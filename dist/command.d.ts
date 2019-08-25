import yargs from 'yargs';
export interface Descriptor<T extends Command> {
    name: string;
    instance: T;
    declaration: new () => T;
}
export interface CommandOptions<T> {
    [name: string]: T;
}
export declare type CommandOptionDeclaration = yargs.Options;
export interface Command {
    description: string;
    options: CommandOptions<CommandOptionDeclaration>;
    run(name: string, options: CommandOptions<unknown>): Promise<void>;
}
export declare function Command<T extends Command>(constructor: new () => T): new () => T;
export declare function IsCommand<T extends Command>(constructor: new () => T): boolean;
