import { ActivityType, Client, Events, GatewayIntentBits, type GuildMember } from "discord.js";

import { info } from "./logger.ts";
import { showWelcome } from "./showWelcome.ts";

const botClient = async (): Promise<Client> => {
  const client: Client = new Client({
    intents: [
      GatewayIntentBits.Guilds
    ],
    presence: {
      activities: [
        {
          name: "Welcoming users",
          type: ActivityType.Custom
        }
      ]
    }
  });

  client.on(Events.GuildMemberAdd, (member: GuildMember): void => {
    showWelcome(member.client, member.user);
  });

  process.on("SIGINT", () => {
    info("Shutting down...");
    client.destroy().then((): void => {
      process.exit();
    });
  });

  return client;
};

export default botClient;
