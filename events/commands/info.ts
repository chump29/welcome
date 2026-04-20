import { parse } from "path"

import {
  type ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder
} from "discord.js"

import { checkRate } from "../../utils/checkRate.ts"
import { error } from "../../utils/logger.ts"

const create = (): RESTPostAPIChatInputApplicationCommandsJSONBody => {
  return new SlashCommandBuilder()
    .setName(parse(import.meta.file).name)
    .setDescription(`Information about ${Bun.env.NAME}`)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .setContexts(InteractionContextType.Guild)
    .toJSON()
}

const invoke = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  if (await checkRate(interaction)) {
    return
  }

  await interaction
    .reply({
      flags: MessageFlags.Ephemeral,
      embeds: [
        new EmbedBuilder()
          .setColor("#78866b")
          .setAuthor({
            iconURL: Bun.env.LOGO_URL,
            name: `${Bun.env.NAME} v${Bun.env.npm_package_version}`
          })
          .setDescription("- Welcomes new users to the server")
          .setFooter({
            text: "By Chris Post"
          })
      ]
    })
    // biome-ignore lint/suspicious/noExplicitAny: catch all errors
    .catch((e: any) => {
      error(e)
      throw e
    })
}

export { create, invoke }
