import dotenv from "dotenv";
import path from "path";
import restify from "restify";

// Import required bot services. See https://aka.ms/bot-services to learn more
// about the different parts of a bot.
import { BotFrameworkAdapter } from "botbuilder";

// This bot's main dialog.
import { EchoBot } from "./bot";

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, ".env");
dotenv.config({
  path: ENV_FILE,
});

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\n${ server.name } listening to ${ server.url }`);
  console.log("\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator");
  console.log("\nTo talk to your bot, open the emulator select \"Open Bot\"");
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
  // This check writes out errors to console log .vs. app insights.
  console.error(`\n [onTurnError]: ${ error }`);
  // Send a message to the user
  await context.sendActivity("Oops. Something went wrong!");
};

// Create the main dialog.
const bot = new EchoBot();

// Listen for incoming requests.
server.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    // Route to main dialog.
    await bot.run(context);
  });
});
