import { parse } from "path"

import {
  type ChatInputCommandInteraction,
  MessageFlags,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  type SlashCommandUserOption
} from "discord.js"

import { checkRate } from "../../utils/checkRate.ts"
import { error } from "../../utils/logger.ts"
import { showWelcome } from "../../utils/showWelcome.ts"

const create = (): RESTPostAPIChatInputApplicationCommandsJSONBody => {
  return new SlashCommandBuilder()
    .setName(parse(import.meta.file).name)
    .setDescription("Send welcome message")
    .addUserOption(
      (option: SlashCommandUserOption): SlashCommandUserOption =>
        option.setName("user").setDescription("User to welcome").setRequired(true)
    )
    .toJSON()
}

const invoke = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  const user = interaction.options.getUser("user")
  if (!user) {
    throw new Error("Invalid user")
  }

  if (await checkRate(interaction, user)) {
    return
  }

  await showWelcome(interaction.channel?.client ?? null, user, interaction.guild?.name as string)
    .then(async (): Promise<void> => {
      await interaction
        .reply({
          content: "_ _",
          flags: MessageFlags.Ephemeral
        })
        .then(async (): Promise<void> => {
          await interaction.deleteReply()
        })
    })
    // biome-ignore lint/suspicious/noExplicitAny: catch all errors
    .catch((e: any) => {
      error(e)
      throw e
    })
}

export { create, invoke }
