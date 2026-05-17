import {
  type Channel,
  type Client,
  EmbedBuilder,
  type Message,
  type TextChannel,
  type User,
  userMention
} from "discord.js"

import { info } from "@postfmly/logger"

const showWelcome = async (client: Client | null, user: User, name: string): Promise<void> => {
  if (!client) {
    throw new Error("Invalid client")
  }

  if (!Bun.env.CHANNEL_ID) {
    throw new Error("Invalid CHANNEL_ID")
  }

  await client.channels.fetch(Bun.env.CHANNEL_ID).then(async (channel: Channel | null): Promise<void | Message> => {
    if (!Bun.env.LOGO_URL) {
      throw new Error("Invalid LOGO_URL")
    }

    if (!Bun.env.LOGO2_URL) {
      throw new Error("Invalid LOGO2_URL")
    }

    if (!channel) {
      throw new Error("Invalid channel")
    }

    await (channel as TextChannel).send({
      content: userMention(user.id),
      embeds: [
        new EmbedBuilder()
          .setColor("#78866b")
          .setAuthor({
            iconURL: user.displayAvatarURL(),
            name: user.displayName
          })
          .setDescription(`# ✨ *Welcome to ${name}!* ✨`)
          .setImage(Bun.env.LOGO2_URL)
          .addFields(
            {
              inline: true,
              name: "Username:",
              value: user.username
            },
            {
              inline: true,
              name: "User ID:",
              value: user.id
            }
          )
          .setFooter({
            iconURL: Bun.env.LOGO_URL,
            text: `${Bun.env.NAME} v${Bun.env.npm_package_version}`
          })
          .setTimestamp()
          .toJSON()
      ]
    })
  })

  if (Bun.env.DEBUG) {
    info(`Welcoming ${user.displayName} (${user.username}) to the server`)
  }
}

export { showWelcome }
