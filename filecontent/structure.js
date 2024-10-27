import { appContent, indexContent } from "./appContent.js";
import { gitignoreContent } from "./gitignore.js";

export const srcFile = [
  {
    file: "index.js",
    content: indexContent
  },
  {
    file: "app.js",
    content: appContent,
  },
];

export const srcFolders = ["database", "controllers", "models", "routes"];

export const rootFile = [
  {
    file: ".gitignore",
    content: gitignoreContent,
  },
  {
    file: ".env",
    content: ``,
  },
  { file: ".env.local", content: `` },
];
