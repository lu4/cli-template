import split from 'split';
import { v1 as uuid } from 'uuid';
import * as fs from 'fs';
import * as mqtt from 'mqtt';
import * as readline from 'readline';

import { MapOf } from '../types';
import { Command, CommandOptions, CommandOptionDeclaration } from '../command';

export interface Record {
    time: string;
    data: string;
    rssi: number;
    address: string;
    company: string;
    resolution: string;
}

export interface PullCommandOptions {
    someDummyParameter: string;
    anotherDummyParameter: number;
}

@Command
export class ParseCommand implements Command {
    public get description(): string {
        return "Parses hcidump output";
    }

    public get options(): CommandOptions<CommandOptionDeclaration> {
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

    public async run(name: string, opts: CommandOptions<unknown>): Promise<void> {
        let record: Record = null as any as Record;
        let buffer: Record[] = [];

        process.stdin.pipe(split()).on('data', (line) => {
            if (line.startsWith('> HCI Event: ')) {
                if (record) {
                    buffer.push(record);
                    process.stdout.write(JSON.stringify(record));
                    process.stdout.write('\n');
                }

                record = {} as any;
                record.time = line.substr(line.length - 26);
            } else if (line.startsWith('        Address: ')) {
                record.address = line.substr(17, 17);
                record.resolution = line.substr(36, line.length - 37);
            } else if (line.startsWith('        RSSI:')) {
                record.rssi = +line.substring(14, line.indexOf(' dBm', 14));
            } else if (line.startsWith('        Company: ')) {
                record.company = line.substring(17, line.lastIndexOf(' ') - 1);
            } else if (line.startsWith('          Data: ')) {
                record.data = line.substring(16);
            }
        });
    }
}
