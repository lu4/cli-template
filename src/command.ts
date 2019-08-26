import yargs from 'yargs';


export interface Descriptor<T extends Command> {
    name: string;
    instance: T;
    declaration: new () => T;
}

export interface CommandOptions<T> {
    [name: string]: T;
}

export type CommandOptionDeclaration = yargs.Options;

export interface Command {
    description: string;
    options: CommandOptions<CommandOptionDeclaration>;

    run(name: string, cwd: string, pwd: string, options: CommandOptions<unknown>): Promise<void>;
}

const CommandSymbol = Symbol('Command');

export function Command<T extends Command>(constructor: new () => T): new () => T {
    Reflect.defineMetadata(CommandSymbol, constructor, constructor);

    return constructor;
}

export function IsCommand<T extends Command>(constructor: new () => T): boolean {
    return Reflect.hasMetadata(CommandSymbol, constructor);
}