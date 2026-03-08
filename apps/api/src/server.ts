import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`easycampus-api listening on http://localhost:${env.port}`);
});

