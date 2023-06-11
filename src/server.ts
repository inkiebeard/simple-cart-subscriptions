import { setupApp } from "./backend/app";

const PORT = process.env.API_PORT;
const app = setupApp();

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
});