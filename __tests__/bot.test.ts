import {
  ActivityHandler,
  TestAdapter,
  TurnContext,
} from "botbuilder-core";
import { Activity } from "botframework-schema";
import { ActivityTypes } from "botbuilder";

import { EchoBot } from "../src/bot";

const testAdapter = new TestAdapter(async () => undefined);

async function processActivity(activity: Partial<Activity>, bot: ActivityHandler) {
  const context = new TurnContext(testAdapter, activity);
  await bot.run(context);
}

test("Messages should be echoed", async () => {
  const bot = new EchoBot();
  const text = "some text to echo";
  const activity = {
    text,
    type: ActivityTypes.Message,
  };

  await processActivity(activity, bot);

  const { text: reply } = testAdapter.activityBuffer.shift();
  expect(reply).toEqual(text);
});

test("Each new chat members should be announced", async () => {
  const bot = new EchoBot();
  const conversation = {
    id: "test-conversation",
    name: "Test Conversation",
    isGroup: true,
    conversationType: "test",
  };
  const recipient = {
    id: "test-account",
    name: "Test Account",
  };
  const membersAdded = [
    {
      id: "user-x",
      name: "User X",
    },
    {
      id: "user-y",
      name: "User Y",
    },
  ];
  const activity = {
    conversation,
    recipient,
    membersAdded,
    type: ActivityTypes.ConversationUpdate,
  };

  await processActivity(activity, bot);

  const { text: welcomeX } = testAdapter.activityBuffer.shift();
  expect(welcomeX).toContain("user-x joined");

  const { text: welcomeY } = testAdapter.activityBuffer.shift();
  expect(welcomeY).toContain("user-y joined");
});
