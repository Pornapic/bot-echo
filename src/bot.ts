// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
  ActivityHandler,
  TurnContext,
} from "botbuilder";

export class EchoBot extends ActivityHandler {
  constructor() {
    super();

    // See https://aka.ms/about-bot-activity-message to learn more about the
    // message and other activity types
    this.onMessage(EchoBot.messageHandler);
    this.onMembersAdded(EchoBot.membersAddedHandler);
  }

  protected static async messageHandler(
    context: TurnContext,
    next: () => Promise<void>,
  ): Promise<void> {
    const { text: textIn } = context.activity;
    await context.sendActivity(textIn);
    return next();
  }

  protected static async membersAddedHandler(
    context: TurnContext,
    next: () => Promise<void>,
  ): Promise<void> {
    const {
      membersAdded,
      recipient,
    } = context.activity;
    await Promise.all(
      membersAdded
        .filter(({ id }) => id !== recipient.id)
        .map(({ id }) => context.sendActivity(`${id} joined... 😏`)),
    );

    return next();
  }
}
