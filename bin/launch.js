#!/usr/bin/env node

const path = require('path');
const { Runner } = require('../dist');

Runner.main(path.join(__dirname, '..'));
