#!/usr/bin/env node
const path = require('path');
const { Runner } = require('.');

Runner.main(path.join(__dirname, '..'));

// const fs = require('fs');
// const path = require('path');

// const lnk = fs.readlinkSync(process.argv[1]);
// const cwd = path.join(path.dirname(process.argv[1]), path.dirname(lnk), '..');

// require(path.join(cwd, 'bootstrap.js')).perform(cwd);
