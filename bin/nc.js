#!/usr/bin/env node

"use strict";

const commander = require("commander");
const { argv } = process;
const { run } = require("../lib/nc");
const { log } = require("console");
const { default: chalk } = require("chalk");
commander.on(`command:${argv[2]}`, async () => {
  if (["rm", "up"].includes(argv[2])) {
    await run(argv[2]);
  } else {
    log(chalk.dim.bold(`please add command ${chalk.blueBright("rm / up")}`));
  }
});

commander.parse(argv);
if (argv.length <= 2) {
  log(chalk.dim.bold(`please add command ${chalk.blueBright("rm / up")}`));
}
