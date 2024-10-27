export const appContent = `import express from "express"
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Welcome to backendfs package')
})

app.listen(port, () => {
  console.log(\`Example app listening on port \${port}\`)
})
  export { app };`;

export const indexContent = `import dotenv from "dotenv";
  import { app } from "./app.js";
    
    dotenv.config({
    path:'./.env'
    
})`;
