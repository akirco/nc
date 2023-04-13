const readline = require("readline");

const dependencies = {
  dependencies: {
    "@types/shelljs": "^0.8.11",
    chalk: "^2.4.1",
    commander: "^2.15.1",
    glob: "^10.0.0"
  },
  devDependencies: {
    husky: "^1.0.0-rc.7",
    "lint-staged": "^7.1.2",
    prettier: "^1.12.1"
  }
};

const listDependencies = dependencies => {
  const keys = Object.keys(dependencies);
  let currentKeyIndex = 0;
  let currentDependencyIndex = 0;

  // const printDependencies = () => {
  //   readline.moveCursor(process.stdout, 0, -1000); // 将光标移动到屏幕最上方
  //   readline.clearScreenDown(process.stdout); // 清除屏幕
  //   const key = keys[currentKeyIndex];
  //   process.stdout.write(key.toUpperCase() + ":\n");
  //   const depKeys = Object.keys(dependencies[key]);
  //   depKeys.forEach((depKey, index) => {
  //     const prefix = index === currentDependencyIndex ? " > " : "   ";
  //     process.stdout.write(prefix + depKey + "\t" + dependencies[key][depKey] + "\n");
  //   });
  // };

  const printDependencies = () => {
    readline.moveCursor(process.stdout, 0, -1000); // 将光标移动到屏幕最上方
    readline.clearScreenDown(process.stdout); // 清除屏幕
    const key = keys[currentKeyIndex];
    console.log(key.toUpperCase() + ":");
    const depKeys = Object.keys(dependencies[key]);
    depKeys.forEach((depKey, index) => {
      const prefix = index === currentDependencyIndex ? " > " : "   ";
      console.log(prefix + depKey + "\t" + dependencies[key][depKey]);
    });
  };

  printDependencies();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.input.on("keypress", (_, key) => {
    if (key.name === "tab") {
      currentDependencyIndex =
        (currentDependencyIndex + 1) % Object.keys(dependencies[keys[currentKeyIndex]]).length;
      printDependencies();
    } else if (key.name === "up") {
      currentKeyIndex = Math.max(0, currentKeyIndex - 1);
      currentDependencyIndex = 0;
      printDependencies();
    } else if (key.name === "down") {
      currentKeyIndex = Math.min(keys.length - 1, currentKeyIndex + 1);
      currentDependencyIndex = 0;
      printDependencies();
    }
  });

  rl.on("SIGINT", () => {
    rl.close();
  });

  rl.on("close", () => {
    process.exit(0);
  });
};

listDependencies(dependencies);
