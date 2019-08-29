import { MapOf } from '../types';
import { Command, CommandOptions, CommandOptionDeclaration } from '../command';

export interface PullCommandOptions {
    someDummyParameter: string;
    anotherDummyParameter: number;
}

@Command
export class ExampleCommandNameCommand implements Command {
    public get description(): string {
        return "[An example command description]";
    }

    public get options(): CommandOptions<CommandOptionDeclaration> {
        if (!process.env.HOME) { throw new Error("Unable to resolve $HOME folder path"); }

        const result: MapOf<PullCommandOptions, CommandOptionDeclaration> = {
            someDummyParameter: {
                nargs: 1,
                type: 'string',
                default: 'A default value',
                description: 'Some parameter description'
            },

            anotherDummyParameter: {
                nargs: 1,
                type: 'string',
                default: 'Another default value',
                description: 'Another parameter description'
            }
        };

        return result;
    }

    public async run(name: string, cwd: string, pwd: string, opts: CommandOptions<unknown>): Promise<void> {
        let options = opts as unknown as PullCommandOptions;

        console.log(`Command ${name} successfully executed`);

        console.log(`Params:`);
        console.log(JSON.stringify(options, null, 2));

        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    public async die(signal: 'SIGINT' | 'SIGTERM' | 'SIGQUIT' | 'SIGHUP' | 'uncaughtException' | 'debug' | 'finish') {
        // Perform all necessary cleanup in this method

        console.log(`${signal} signal received, waiting 1 second before dying`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before actually dying
        console.log(`${signal} ok, dying...`);
    }
}