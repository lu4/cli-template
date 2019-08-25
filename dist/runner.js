"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const yargs_1 = __importDefault(require("yargs"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const command_1 = require("./command");
class Runner {
    static main(pwd) {
        return __awaiter(this, void 0, void 0, function* () {
            let directory = './commands';
            let filenames = fs
                .readdirSync(path.join(__dirname, directory))
                .filter(filename => path.extname(filename) === '.d.ts' || path.extname(filename) === '.ts');
            let descriptors = [];
            for (let filename of filenames) {
                let joined = path.join(directory, filename);
                if (joined.toLocaleLowerCase().endsWith('.d.ts')) {
                    joined = joined.substring(0, joined.length - 5);
                }
                else if (joined.toLocaleLowerCase().endsWith('.ts')) {
                    joined = joined.substring(0, joined.length - 3);
                }
                let module = yield Promise.resolve().then(() => __importStar(require(`./${joined}`)));
                let declarations = Object.keys(module).map(key => module[key]);
                for (let declaration of declarations) {
                    if (command_1.IsCommand(declaration)) {
                        let name = path.parse(filename).name;
                        let instance = new declaration();
                        descriptors.push({ name, instance, declaration });
                    }
                }
            }
            descriptors.sort((x, y) => x.name < y.name ? -1 : x.name === y.name ? 0 : 1);
            yargs_1.default
                .help()
                .scriptName(JSON.parse(fs.readFileSync(path.join(pwd, 'package.json')).toString()).name)
                .usage('Usage: $0 <command> [options]')
                .demandCommand(1);
            for (const descriptor of descriptors) {
                yargs_1.default.command(descriptor.name, descriptor.instance.description, args => {
                    const { options } = descriptor.instance;
                    const keys = Object.keys(options);
                    keys.sort();
                    for (const key of keys) {
                        args = args.option(key, options[key]);
                    }
                    return args;
                });
            }
            const argv = yargs_1.default.help('h')
                .strict()
                .alias('h', 'help')
                .showHelpOnFail(true)
                .parse();
            const [commandName] = argv._;
            const target = descriptors.find(x => x.name === commandName);
            if (target) {
                yield target.instance.run(commandName, argv);
            }
            else {
                console.log(`Command '${commandName}' not found!`);
            }
        });
    }
}
exports.Runner = Runner;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3J1bm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRCQUEwQjtBQUUxQixrREFBMEI7QUFFMUIsdUNBQXlCO0FBQ3pCLDJDQUE2QjtBQUU3Qix1Q0FBMkQ7QUFFM0QsTUFBYSxNQUFNO0lBQ1IsTUFBTSxDQUFPLElBQUksQ0FBQyxHQUFXOztZQUNoQyxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUM7WUFDN0IsSUFBSSxTQUFTLEdBQUcsRUFBRTtpQkFDYixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQzVDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUM7WUFFaEcsSUFBSSxXQUFXLEdBQStCLEVBQUUsQ0FBQztZQUVqRCxLQUFLLElBQUksUUFBUSxJQUFJLFNBQVMsRUFBRTtnQkFDNUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRTVDLElBQUksTUFBTSxDQUFDLGlCQUFpQixFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUM5QyxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDbkQ7cUJBQU0sSUFBSSxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQ25ELE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxHQUFH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