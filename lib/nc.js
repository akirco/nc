"use strict";
const path = require("path");
const fs = require("fs");
const { readFile } = require("fs/promises");
const cwd = process.cwd();
const cp = require("child_process");
const readline = require("readline");
const { default: chalk } = require("chalk");

async function run(command) {
  const packageJson = await getPackageJSONDeps();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const dependencies = Object.keys(packageJson.dependencies);
  const devDependencies = Object.keys(packageJson.devDependencies);
  const options = [...dependencies, ...devDependencies];

  let selectedIndex = 0;

  const renderOptions = () => {
    console.clear();
    console.log(chalk.cyan("dependencies:"));
    dependencies.forEach((name, index) => {
      console.log(
        `  ${selectedIndex === index ? chalk.green(">") : " "} ${chalk.bold(name)}: ${
          selectedIndex === index
            ? chalk.green(packageJson.dependencies[name])
            : chalk.dim(packageJson.dependencies[name])
        }`
      );
    });

    console.log(chalk.cyan("devDependencies:"));
    devDependencies.forEach((name, index) => {
      console.log(
        `  ${selectedIndex === dependencies.length + index ? chalk.green(">") : " "} ${chalk.bold(
          name
        )}: ${
          selectedIndex === dependencies.length + index
            ? chalk.green.bold(packageJson.devDependencies[name])
            : chalk.dim(packageJson.devDependencies[name])
        }`
      );
    });

    // rl.write("> " + options[selectedIndex]);
  };

  renderOptions();

  rl.input.on("keypress", (_, key) => {
    if (key.name === "escape" || (key.name === "c" && key.ctrl)) {
      rl.close();
    }

    if (key.name === "tab" || key.name === "down") {
      selectedIndex = (selectedIndex + 1) % options.length;
      renderOptions();
    } else if (key.name === "up") {
      if (!selectedIndex) {
        selectedIndex = options.length;
      }
      selectedIndex = (selectedIndex - 1) % options.length;
      renderOptions();
    } else if (key.name === "return") {
      const selectedOption = options[selectedIndex];
      // const isDevDependency = devDependencies.includes(selectedOption);
      // console.log(
      //   `您选择了 ${chalk.bold(selectedOption)}，版本号为 ${
      //     isDevDependency
      //       ? chalk.green(packageJson.devDependencies[selectedOption])
      //       : chalk.green(packageJson.dependencies[selectedOption])
      //   }`
      // );
      exec(command, selectedOption);
      rl.close();
    }
  });
}

async function getPackageJSONDeps() {
  const packageJSON = path.join(cwd, "package.json");
  if (fs.existsSync(packageJSON)) {
    const result = await readFile(packageJSON, { encoding: "utf-8" });
    const resultJSON = JSON.parse(result);
    return {
      dependencies: resultJSON.dependencies,
      devDependencies: resultJSON.devDependencies
    };
  } else {
    console.log(chalk.gray("please switch to the project root dir ..."));
    process.exit();
  }
}

function exec(command, deps) {
  let bin;
  let cmd;
  const npmlock = path.join(cwd, "package.lock");
  const yarnlock = path.join(cwd, "yarn.lock");
  const pnpmlock = path.join(cwd, "pnpm.lock");

  if (fs.existsSync(npmlock)) {
    if (command === "rm") {
      cmd = "uninstall";
    }
    if (command === "up") {
      cmd = "update --save";
    }
    bin = "npm";
  } else if (fs.existsSync(yarnlock)) {
    if (command === "rm") {
      cmd = "remove";
    }
    if (command === "up") {
      cmd = "upgrade";
    }
    bin = "yarn";
  } else if (fs.existsSync(pnpmlock)) {
    if (command === "rm") {
      cmd = "remove";
    }
    if (command === "up") {
      cmd = "update --latest";
    }
    bin = "pnpm";
  } else {
    process.exit(0);
  }
  const out = cp.exec(`${bin} ${cmd} ${deps}`);
  out.stdout.on("data", chunk => {
    console.log(chalk.dim(chunk));
  });
}

module.exports = { run };
