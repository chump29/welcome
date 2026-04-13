import {
  type ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder
} from "discord.js"

import { checkRate } from "../../utils/checkRate.ts"
import { error } from "../../utils/logger.ts"

const create = (): RESTPostAPIChatInputApplicationCommandsJSONBody => {
  return new SlashCommandBuilder().setName("info").setDescription("Information about WelcomeBot").toJSON()
}

const embed: EmbedBuilder = new EmbedBuilder()
  .setColor(0x78866b)
  .setAuthor({
    iconURL: Bun.env.LOGO_URL,
    name: `WelcomeBot v${Bun.env.npm_package_version}`
  })
  .setDescription("- Welcomes new users to the server")
  .setFooter({
    text: "By Chris Post"
  })

const invoke = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  if (await checkRate(interaction)) {
    return
  }

  await interaction
    .reply({
      flags: MessageFlags.Ephemeral,
      embeds: [
        embed
      ]
    })
    // biome-ignore lint/suspicious/noExplicitAny: catch all errors
    .catch((e: any) => {
      error(e)
      throw e
    })
}

export { create, invoke }
