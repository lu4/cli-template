import { Command, CommandOptions, CommandOptionDeclaration } from '../command';
export interface PullCommandOptions {
    someDummyParameter: string;
    anotherDummyParameter: number;
}
export declare class ExampleCommandNameCommand implements Command {
    readonly description: string;
    readonly options: CommandOptions<CommandOptionDeclaration>;
    run(name: string, opts: CommandOptions<unknown>): Promise<void>;
}
