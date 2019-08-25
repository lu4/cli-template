"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
let ExampleCommandNameCommand = class ExampleCommandNameCommand {
    get description() {
        return "[An example command description]";
    }
    get options() {
        if (!process.env.HOME) {
            throw new Error("Unable to resolve $HOME folder path");
        }
        const result = {
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
    run(name, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let options = opts;
            console.log(`Command ${name} successfully executed`);
            console.log(`Params:`);
            console.log(JSON.stringify(options, null, 2));
        });
    }
};
ExampleCommandNameCommand = __decorate([
    command_1.Command
], ExampleCommandNameCommand);
exports.ExampleCommandNameCommand = ExampleCommandNameCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbXBsZS1jb21tYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbW1hbmRzL2V4YW1wbGUtY29tbWFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsd0NBQStFO0FBUS9FLElBQWEseUJBQXlCLEdBQXRDLE1BQWEseUJBQXlCO0lBQ2xDLElBQVcsV0FBVztRQUNsQixPQUFPLGtDQUFrQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxJQUFXLE9BQU87UUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7U0FBRTtRQUVsRixNQUFNLE1BQU0sR0FBd0Q7WUFDaEUsa0JBQWtCLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRSxDQUFDO2dCQUNSLElBQUksRUFBRSxRQUFRO2dCQUNkLE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLFdBQVcsRUFBRSw0QkFBNEI7YUFDNUM7WUFFRCxxQkFBcUIsRUFBRTtnQkFDbkIsS0FBSyxFQUFFLENBQUM7Z0JBQ1IsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsT0FBTyxFQUFFLHVCQUF1QjtnQkFDaEMsV0FBVyxFQUFFLCtCQUErQjthQUMvQztTQUNKLENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRVksR0FBRyxDQUFDLElBQVksRUFBRSxJQUE2Qjs7WUFDeEQsSUFBSSxPQUFPLEdBQUcsSUFBcUMsQ0FBQztZQUVwRCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVksSUFBSyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7Q0FDSixDQUFBO0FBbENZLHlCQUF5QjtJQURyQyxpQkFBTztHQUNLLHlCQUF5QixDQWtDckM7QUFsQ1ksOERBQXlCIn0=