import { type Client } from "discord.js";

import loadCommands from "./events/loadCommands.ts";
import botClient from "./utils/botClient.ts";
import { info } from "./utils/logger.ts";

const CLIENT: Client = await botClient();

await loadCommands(CLIENT)
  .then(async (): Promise<string> => await CLIENT.login(Bun.env.TOKEN))
  .then((): void => info("Running..."));
