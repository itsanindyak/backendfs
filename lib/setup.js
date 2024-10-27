import fs from "fs";
import { execSync } from "child_process";
import { checkbox, confirm, input, search } from "@inquirer/prompts";
import { rootFile, srcFile, srcFolders } from "../filecontent/structure.js";
import path from "path";

// node init

const nodeInit = async () => {
  execSync("node --version", { stdio: "ignore" });
  execSync("npm init -y", { stdio: "ignore" });

  const packageJsonPath = path.join(process.cwd(), "package.json");

  // Read the existing package.json
  if (fs.existsSync(packageJsonPath)) {
    const name = await input({ message: "Enter package name" });
    const description = await input({ message: "Enter description" });
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    // Customize the package.json fields
    packageJson.name = name;
    packageJson.version = "1.0.0"; // Set the version
    packageJson.description = description.length !== 0 ? description : ""; // Add description
    packageJson.scripts = {
      dev: "nodemon -r dotenv/config --experimental-json-modules src/index.js",
    };
    packageJson.type = "module";
    packageJson.main = "src/index.js";

    // Write the modified package.json back to the file
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } else {
    console.error("package.json not found in the current directory.");
  }
};

// Prompt for additional folders and exclusions
const promptFolders = async () => {
  // Ask if any additional folders are needed

  const answer = await confirm({
    message: "Are you additional folder to create in src",
  });

  let additionalFolders = "";

  if (answer) {
    additionalFolders = await input({
      message: "Enter any additional folders to create (comma-separated):",
    });
  }

  const addFolder =
    additionalFolders.length !== 0
      ? additionalFolders.split(",").map((f) => f.trim())
      : [];

  const folders = srcFolders.concat(addFolder);

  return folders;
};

//prompting dependenceies
const promptDependencies = async () => {
  const answer = await confirm({
    message: "Do you want to add additional dependencies?",
  });

  let additionalDeps = [];

  if (answer) {
    let continueAdding = true;

    while (continueAdding) {
      const selectedDeps = await search({
        message:
          "Select one or more npm packages (use comma-separated input or multiple selections):",
        multiple: true, // Allows multiple selections
        source: async (input, { signal }) => {
          if (!input) {
            return [];
          }

          const response = await fetch(
            `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(
              input
            )}&size=20`,
            { signal }
          );
          const data = await response.json();

          return data.objects.map((pkg) => ({
            name: `${pkg.package.name} - ${pkg.package.description}`,
            value: pkg.package.name,
          }));
        },
      });

      // Add the selected dependencies to the list
      additionalDeps = additionalDeps.concat(selectedDeps);

      // Ask if the user wants to add more dependencies
      continueAdding = await confirm({
        message: "Would you like to add more dependencies?",
      });
    }
  }

  return additionalDeps.filter((dep) => dep); // Return all selected dependencies
};

// prompting devdependencies
const promptDevDependencies = async () => {
  const answer = await confirm({
    message: "Do you want to add additional devdependencies?",
  });

  let additionalDeps = [];

  if (answer) {
    let continueAdding = true;

    while (continueAdding) {
      const selectedDeps = await search({
        message:
          "Select one or more npm packages (use comma-separated input or multiple selections):",
        multiple: true, // Allows multiple selections
        source: async (input, { signal }) => {
          if (!input) {
            return [];
          }

          const response = await fetch(
            `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(
              input
            )}&size=20`,
            { signal }
          );
          const data = await response.json();

          return data.objects.map((pkg) => ({
            name: `${pkg.package.name} - ${pkg.package.description}`,
            value: pkg.package.name,
          }));
        },
      });

      // Add the selected dependencies to the list
      additionalDeps = additionalDeps.concat(selectedDeps);

      // Ask if the user wants to add more dependencies
      continueAdding = await confirm({
        message: "Would you like to add more dependencies?",
      });
    }
  }

  return additionalDeps.filter((dep) => dep); // Return all selected dependencies
};

// Folder creation function
const createStructure = async () => {

  console.log("====Default src structure====");
  console.log("src\n|-app.js\n|-controllers\n|-database\n|-index.js\n|-models\n|-routes");
  const folders = await promptFolders();

  // src folder

  const srcPath = path.join(process.cwd(), "src");
  if (!fs.existsSync(srcPath)) {
    fs.mkdirSync(srcPath);
    console.log("src");
  } else {
    console.error("Src folder already exist");
  }

  folders.forEach((folder) => {
    if (!fs.existsSync(`${srcPath}/${folder}`)) {
      fs.mkdirSync(`${srcPath}/${folder}`);
      console.log(`✅${folder}`);
    } else {
      console.error(`${folder} already exist. ❌ `);
    }
  });

  // create srcfile

  srcFile.forEach((obj) => {
    if (!fs.existsSync(`${srcPath}/${obj.file}`)) {
      fs.writeFileSync(`${srcPath}/${obj.file}`, obj.content);
    } else {
      console.error(`${obj.file} file already exist`);
    }
  });

  // create rootfile

  const rootPath = process.cwd();
  rootFile.forEach((obj) => {
    if (!fs.existsSync(`${rootPath}/${obj.file}`)) {
      fs.writeFileSync(`${rootPath}/${obj.file}`, obj.content);
    } else {
      console.error(`${obj.file} file already exist`);
    }
  });
};

// Dependency installation
const installDependencies = async () => {
  const dependencies = ["express", "dotenv", "mongoose"];
  const devDependencies = ["nodemon"];

  const additionalDeps = await promptDependencies();
  const additionalDevDeps = await promptDevDependencies();
  dependencies.push(...additionalDeps);
  devDependencies.push(...additionalDevDeps);

  console.log(`Installing dependencies: ${dependencies.join(", ")}`);
  execSync(`npm install ${dependencies.join(" ")}`, { stdio: "inherit" });
  console.log("Dependencies installed.");

  console.log(`Installing devdependencies: ${devDependencies.join(", ")}`);
  execSync(`npm install ${devDependencies.join(" ")} --save-dev`, {
    stdio: "inherit",
  });
  console.log("Devdependencies installed.");
};
// git initialize
const gitInit = async () => {
  const args = process.argv.slice(2);
  const shouldInitGit = args.includes("-gi") || args.includes("--git");

  if (shouldInitGit) {
    try {
      // Check if Git is installed
      execSync("git --version", { stdio: "ignore" });

      // Initialize Git repository
      execSync("git init", { stdio: "inherit" });
      console.log("Git repository initialized.");
    } catch (error) {
      console.error("Error: Git is not installed or could not initialize Git.");
    }
  } else {
    console.log("Git initialization skipped.");
  }
};
const displayTree = (dirPath, indent = "") => {
  const items = fs.readdirSync(dirPath);

  items.forEach((item, index) => {
    if (item === "node_modules") {
      return;
    }
    const fullPath = path.join(dirPath, item);

    const isLastItem = index === items.length - 1;
    const prefix = isLastItem ? "└── " : "├── ";
    const nextIndent = indent + (isLastItem ? "    " : "│   ");

    console.log(indent + prefix + item);

    if (fs.statSync(fullPath).isDirectory()) {
      displayTree(fullPath, nextIndent); // Recur for subdirectories
    }
  });
};

// Run the setup functions
export const setupProject = async () => {
  await nodeInit();
  await createStructure();
  await installDependencies();
  await gitInit();
  console.log("=====Folder structure====\n\n");
  displayTree(process.cwd());

  execSync("npm run dev", { stdio: "inherit" });
};
