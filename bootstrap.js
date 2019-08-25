const path = require('path');

module.exports.perform = function (cwd) {
    const project = path.join(cwd, 'tsconfig.json');

    console.log('Trying to register ts-node with tsconfig.json found at:');
    console.log(project);

    const tsnode = require('ts-node');

    tsnode.register({ cwd: cwd, project })

    const { Runner } = require('./src')

    Runner.main(cwd);
}