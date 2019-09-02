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

export interface CommandState {
    [index: string]: any;
}

export interface CommandEnvironment {
    userWorkDir: string;
    systemWorkDir: string;
    currentWorkDir: string;
    projectWorkDir: string;

    commandName: string;
}

export interface Command extends CommandState {
    description: string;
    options: CommandOptions<CommandOptionDeclaration>;

    run(environment: CommandEnvironment, options: CommandOptions<unknown>): Promise<void>;

    catch?(signal: 'SIGINT' | 'SIGTERM' | 'SIGQUIT' | 'SIGHUP' | 'uncaughtException' | 'debug'): Promise<void>;
    finally?(signal: 'SIGINT' | 'SIGTERM' | 'SIGQUIT' | 'SIGHUP' | 'uncaughtException' | 'debug' | 'success'): Promise<void>;
}

const CommandSymbol = Symbol('Command');

export function Command<T extends Command>(constructor: new () => T): new () => T {
    Reflect.defineMetadata(CommandSymbol, constructor, constructor);

    return constructor;
}

export const PersistMap = new Map<Command, string[]>();

// tslint:disable-next-line: ban-types
export function Persist<T extends Command>(target: T, propertyName: string) {
    const properties: string[] | undefined = PersistMap.get(target);

    if (properties) {
        properties.push(propertyName);
    } else {
        PersistMap.set(target, [propertyName]);
    }
}

export function IsCommand<T extends Command>(constructor: new () => T): boolean {
    return Reflect.hasMetadata(CommandSymbol, constructor);
}