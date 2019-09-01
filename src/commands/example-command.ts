import { MapOf } from '../types';
import { Command, CommandOptions, CommandOptionDeclaration, Persist, CommandEnvironment } from '../command';

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


    @Persist
    private persistedValue: number = Math.random();

    public async run(environment: CommandEnvironment, opts: CommandOptions<unknown>): Promise<void> {
        let options = opts as unknown as PullCommandOptions;

        console.log(`Command ${environment.commandName} successfully executed`);

        console.log(`Params:`);
        console.log(JSON.stringify(options, null, 2));

        console.log('Persisted value: ' + this.persistedValue);
        console.log(`Press Ctrl-C to test 'catch' and 'finally' methods`);

        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    // Optional: 
    public async catch(signal: 'SIGINT' | 'SIGTERM' | 'SIGQUIT' | 'SIGHUP' | 'uncaughtException' | 'debug') {
        // Perform all necessary cleanup in this method

        console.log(`catch: ${signal} signal caught, waiting 1 second before passing controll to 'finally' handler`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before actually dying
    }

    // Optional: 
    public async finally(signal: 'SIGINT' | 'SIGTERM' | 'SIGQUIT' | 'SIGHUP' | 'uncaughtException' | 'debug' | 'success') {
        // Perform all necessary cleanup in this method

        console.log(`finally: ${signal} signal caught, waiting 1 second before dying`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before actually dying
        console.log(`Successfully handled '${signal}', dying finally...`);
    }
}