#!/usr/bin/env node

"use strict";

const commander = require("commander");
const { argv } = process;
const { run } = require("../lib/nc");
commander.on(`command:${argv[2]}`, async () => {
  await run(argv[2]);
});

commander.parse(argv);
