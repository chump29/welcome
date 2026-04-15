import { ActivityType, Client, Events, GatewayIntentBits, type GuildMember } from "discord.js"

import { info } from "./logger.ts"
import { SERVER } from "./logo.ts"
import { showWelcome } from "./showWelcome.ts"

const client = async (): Promise<Client> => {
  const client: Client = new Client({
    intents: [
      GatewayIntentBits.Guilds
    ],
    presence: {
      activities: [
        {
          name: "Welcoming new users...",
          type: ActivityType.Custom
        }
      ]
    }
  })

  client.on(Events.GuildMemberAdd, (member: GuildMember): void => {
    showWelcome(member.client, member.user, member.guild.name)
  })

  const shutdown = async (): Promise<void> => {
    info("Shutting down...")
    await client
      .destroy()
      .then(async (): Promise<void> => await SERVER?.stop(true))
      .then((): void => process.exit())
  }

  process.on("SIGINT", async (): Promise<void> => {
    await shutdown()
  })

  process.on("SIGTERM", async (): Promise<void> => {
    await shutdown()
  })

  return client
}

const login = async (client: Client): Promise<void> => {
  await client.login(Bun.env.TOKEN)

  if (client.user && Bun.env.DEBUG) {
    info(`Connected as ${client.user.displayName} (${client.user.tag})`)
  }
}

export { client, login }
