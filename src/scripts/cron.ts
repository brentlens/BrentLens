import cron from "node-cron";
import { fetchBrentData, runEmail } from "./brent_crude";

// minute, hour, day, month, day of week
cron.schedule("* * * * *", async () => {
  console.log("Running every minute...");
  runEmail()
});

console.log("Cron started");