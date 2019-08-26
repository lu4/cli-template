
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

        console.log(`Command ${ name } successfully executed`);
        console.log(`Params:`);
        console.log(JSON.stringify(options, null, 2));
    }
}