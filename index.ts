import { error, info } from "@postfmly/logger"
import { startLogoServer } from "@postfmly/logoserver"

import { loadCommands } from "./events/loadCommands.ts"
import { client, login, shutdown } from "./utils/client.ts"

Bun.env.DEBUG = Bun.env.IS_DEBUG === "true" ? true : false

Bun.env.NAME = Bun.env.NAME || "WelcomeBot"

await loadCommands(await client())
  .then(async (): Promise<void> => await login())
  .then(async (): Promise<void> => await startLogoServer())
  .then((): void => info("Running..."))
  .catch(async (e: unknown): Promise<void> => {
    error(e)
    await shutdown("ERROR")
  })
