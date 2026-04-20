import {
  type Channel,
  type Client,
  EmbedBuilder,
  type Message,
  type TextChannel,
  type User,
  userMention
} from "discord.js"

import { info } from "./logger.ts"

const showWelcome = async (client: Client | null, user: User, name: string): Promise<void> => {
  if (!client) {
    throw new Error("Invalid client")
  }

  await client.channels.fetch(Bun.env.CHANNEL_ID).then(async (channel: Channel | null): Promise<void | Message> => {
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
          .setImage(Bun.env.WELCOME_IMAGE_URL)
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
    info(`Welcome ${user.displayName} to the server`)
  }
}

export { showWelcome }
