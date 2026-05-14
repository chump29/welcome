import { describe, expect, jest, mock, spyOn, test } from "bun:test"

import {
  type ActivitiesOptions,
  ActivityType,
  type Client,
  type ClientUser,
  GatewayIntentBits,
  type IntentsBitField
} from "discord.js"

import { fake } from "@nano-faker/patterns"

import { client, login, shutdown } from "./client.ts"

describe("client", (): void => {
  spyOn(process, "exit").mockImplementation((code: number): never => {
    throw new Error(code.toString())
  })

  test("shutdown", async (): Promise<void> => {
    expect(shutdown("TEST")).rejects.toThrowError("0")

    await shutdown("TEST2") // * NOTE: to test isShutdown
  })

  test("login fail - client", (): void => {
    expect(login()).rejects.toThrowError("Invalid CLIENT")
  })

  test("client", async (): Promise<void> => {
    const processSpy: jest.Mock = spyOn(process, "on")

    const clientObj: Client = await client()
    expect(clientObj).not.toBeUndefined()

    const intents: IntentsBitField = clientObj.options.intents
    expect(intents.has(GatewayIntentBits.Guilds)).toBeTrue()

    const activities: ActivitiesOptions | undefined = clientObj.options.presence!.activities![0]
    expect(activities).not.toBeUndefined()
    expect(activities!.name === "Welcoming new users...").toBeTrue()
    expect(activities!.type === ActivityType.Custom).toBeTrue()

    // ! TODO: test CLIENT.on(Events.GuildMemberAdd)

    mock.module("./client.ts", (): unknown => {
      return {
        shutdown: jest.fn()
      }
    })

    process.emit("SIGINT")
    expect(processSpy).toHaveBeenNthCalledWith(1, "SIGINT", expect.any(Function))

    process.emit("SIGTERM")
    expect(processSpy).toHaveBeenNthCalledWith(2, "SIGTERM", expect.any(Function))
  })

  test("login fail - token", (): void => {
    expect(login()).rejects.toThrowError("Invalid TOKEN")
  })

  test("login pass", async (): Promise<void> => {
    mock.module("./client.ts", (): unknown => {
      return {
        TEST_CLIENT: {
          login: jest.fn(),
          user: {
            displayName: Bun.env.NAME,
            tag: `${Bun.env.NAME}#${fake("####")}`
          } as ClientUser
        } as unknown as Client
      }
    })

    const ID_LEN: number = 26
    const TS_LEN: number = 6
    const HMAC_LEN: number = 38

    Bun.env.TOKEN = fake(`${"*".repeat(ID_LEN)}.${"*".repeat(TS_LEN)}.${"*".repeat(HMAC_LEN)}`)

    const consoleSpy: jest.Mock = spyOn(console, "info")

    await login()

    expect(consoleSpy).toHaveBeenLastCalledWith(
      expect.any(String),
      expect.stringContaining(`Connected as ${Bun.env.NAME}`)
    )
  })
})
