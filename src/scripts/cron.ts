import cron from "node-cron";
import { fetchBrentData } from "./brent_crude";

// minute, hour, day, month, day of week
cron.schedule("* * * * *", async () => {
  console.log("Running every minute...");
  fetchBrentData()
});

console.log("Cron started");