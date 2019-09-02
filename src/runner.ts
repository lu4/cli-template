import 'reflect-metadata';

import * as path from 'path';

import fs from 'fs';
import yargs from 'yargs';
import death from 'death';
import specialFolder from 'platform-folders';

import { Descriptor, Command, IsCommand, PersistMap, CommandState } from './command';

export class Runner {
    public static async main() {
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

        const cwd = process.cwd();
        const pwd = path.join(__dirname, '..');
        const scriptName = JSON.parse(fs.readFileSync(path.join(pwd, 'package.json')).toString()).name;

        yargs
            .help()
            .scriptName(scriptName)
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
            const uwd = path.join(specialFolder('userData') || pwd, scriptName, 'user', commandName);
            const swd = path.join(specialFolder('userData') || pwd, scriptName, 'system', commandName);

            if (!fs.existsSync(swd)) {
                try {
                    fs.mkdirSync(swd, { recursive: true });
                } catch {
                    // Nothing here
                }
            }

            if (!fs.existsSync(uwd)) {
                try {
                    fs.mkdirSync(uwd, { recursive: true });
                } catch {
                    // Nothing here
                }
            }

            const checkpointPath = path.join(swd, 'checkpoint.json');
            const prototype = Object.getPrototypeOf(target.instance);
            const properties = PersistMap.get(prototype);

            if (properties && properties.length) {
                try {
                    const state: CommandState = JSON.parse(fs.readFileSync(checkpointPath).toString());

                    for (const property of properties) {
                        if (property in target.instance) {
                            target.instance[property] = state[property];
                        }
                    }
                } catch {
                    // Nothing here
                }
            }

            let dying = false;

            const handleDeath = async (signal: 'SIGINT' | 'SIGTERM' | 'SIGQUIT' | 'SIGHUP' | 'uncaughtException' | 'debug') => {
                // Make sure we die once
                if (dying === false) { // Due to aesthetic reasons
                    dying = true;

                    try {
                        if (properties && properties.length) {
                            const commandState: CommandState = {};

                            properties.forEach(property => {
                                commandState[property] = target.instance[property];
                            });

                            fs.writeFileSync(checkpointPath, JSON.stringify(commandState, null, 2));
                        }
                    } catch {
                        // Nothing here
                    }

                    try {
                        if (target.instance.catch) {
                            await target.instance.catch(signal);
                        }
                    } catch {
                        // Nothing here
                    }

                    try {
                        if (target.instance.finally) {
                            await target.instance.finally(signal);
                        }
                    } catch {
                        // Nothing here
                    }

                    try {
                        unsubscribe();
                    } catch {
                        // Nothing here
                    }

                    process.exit(process.exitCode);
                }
            };

            const unsubscribe = death({
                // SIGHUP: true, // Add this option if you know what you are doing
                SIGINT: true, SIGQUIT: true, SIGTERM: true, uncaughtException: true
            })(handleDeath);

            let result: 'success' | 'uncaughtException' = 'success';

            try {
                await target.instance.run({ commandName, currentWorkDir: cwd, projectWorkDir: pwd, systemWorkDir: swd, userWorkDir: uwd }, argv);
            } catch {
                if (target.instance.catch) {
                    target.instance.catch(result = 'uncaughtException');
                }
            }

            try {
                if (target.instance.finally) {
                    await target.instance.finally(result);
                }
            } catch {
                // Nothing here
            }

            try {
                fs.unlinkSync(checkpointPath);
            } catch {
                // Nothing here
            }

        } else {
            console.log(`Command '${commandName}' not found!`);
        }
    }
}