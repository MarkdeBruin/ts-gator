import { setUser, readConfig } from "./config.js";

function main() {
  setUser("Mark");
  const cfg = readConfig();
  console.log("Current config:", cfg);
}

main();
