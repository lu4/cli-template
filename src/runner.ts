import 'reflect-metadata';

import fs from 'fs';
import yargs from 'yargs';
import death from 'death';
import specialFolder from 'platform-folders';

import * as path from 'path';

import { Descriptor, Command, IsCommand } from './command';

export class Runner {
    public static async main() {
        const cwd = process.cwd();
        const pwd = path.join(__dirname, '..');
        const swd = path.join(specialFolder('userData') || pwd, 'database');

        if (!fs.existsSync(swd)) {
            fs.mkdirSync(swd);
        }

        let directory = './commands';
        let filenames = fs
            .readdirSync(path.join(__dirname, directory))
            .filter(filename => path.extname(filename) === '.d.ts' || path.extname(filename) === '.ts');

        let descriptors: Array<Descriptor<Command>> = [];

        for (let filename of filenames) {
            let joined = path.join(directory, filename);

            if (joined.toLocaleLowerCase().endsWith('.d.ts')) {
                joined = joined.substring(0, joined.length - 5);
            } else if (joined.toLocaleLowerCase().endsWith('.ts')) {
                joined = joined.substring(0, joined.length - 3);
            }

            let module = await import(`./${joined}`);

            let declarations: Array<new () => Command> = Object.keys(module).map(key => module[key]);

            for (let declaration of declarations) {
                if (IsCommand(declaration)) {
                    let name = path.parse(filename).name;
                    let instance = new declaration();

                    descriptors.push({ name, instance, declaration });
                }
            }
        }

        descriptors.sort((x, y) => x.name < y.name ? -1 : x.name === y.name ? 0 : 1);

        yargs
            .help()
            .scriptName(JSON.parse(fs.readFileSync(path.join(pwd, 'package.json')).toString()).name)
            .usage('Usage: $0 <command> [options]')
            .demandCommand(1);

        for (const descriptor of descriptors) {
            yargs.command(descriptor.name, descriptor.instance.description, args => {
                const { options } = descriptor.instance;

                const keys = Object.keys(options);

                keys.sort();

                for (const key of keys) {
                    args = args.option(key, options[key]);
                }

                return args;
            });
        }

        const argv = yargs.help('h')
            .strict()
            .alias('h', 'help')
            .showHelpOnFail(true)
            .parse();

        const [commandName] = argv._;
        const target = descriptors.find(x => x.name === commandName);

        if (target) {
            const unsubscribe = death(async signal => {
                await target.instance.die(signal);

                unsubscribe();
                process.exit();
            });

            await target.instance.run(commandName, cwd, pwd, argv);
        } else {
            console.log(`Command '${commandName}' not found!`);
        }
    }
}