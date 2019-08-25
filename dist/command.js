"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommandSymbol = Symbol('Command');
function Command(constructor) {
    Reflect.defineMetadata(CommandSymbol, constructor, constructor);
    return constructor;
}
exports.Command = Command;
function IsCommand(constructor) {
    return Reflect.hasMetadata(CommandSymbol, constructor);
}
exports.IsCommand = IsCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBc0JBLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUV4QyxTQUFnQixPQUFPLENBQW9CLFdBQXdCO0lBQy9ELE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUVoRSxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDO0FBSkQsMEJBSUM7QUFFRCxTQUFnQixTQUFTLENBQW9CLFdBQXdCO0lBQ2pFLE9BQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUZELDhCQUVDIn0=