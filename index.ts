import { type Client } from "discord.js"

import { loadCommands } from "./events/loadCommands.ts"
import { client, login } from "./utils/client.ts"
import { info } from "./utils/logger.ts"
import { logo } from "./utils/logo.ts"

Bun.env.DEBUG = Bun.env.IS_DEBUG === "true" ? true : false

await loadCommands(await client())
  .then(async (client: Client): Promise<void> => await login(client))
  .then(async (): Promise<void> => await logo())
  .then((): void => info("Running..."))
