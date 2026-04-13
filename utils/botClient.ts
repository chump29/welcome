import { ActivityType, Client, Events, GatewayIntentBits, type GuildMember } from "discord.js"

import { info } from "./logger.ts"
import { SERVER } from "./logo.ts"
import { showWelcome } from "./showWelcome.ts"

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
  })

  client.on(Events.GuildMemberAdd, (member: GuildMember): void => {
    showWelcome(member.client, member.user, member.guild.name)
  })

  process.on("SIGINT", () => {
    info("Shutting down...")
    client.destroy().then((): void => {
      SERVER?.stop(true)
      process.exit()
    })
  })

  return client
}

export default botClient
