#!/usr/bin/env node

const path = require('path');
const { Runner } = require('../build');

Runner.main(path.join(__dirname, '..'));
