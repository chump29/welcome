import { describe, expect, jest, test } from "bun:test"

import { type ChannelManager, type Client, type TextChannel, type User } from "discord.js"

import { url, username } from "@nano-faker/internet"
import { fake } from "@nano-faker/patterns"
import { fullName } from "@nano-faker/person"

import { showWelcome } from "./showWelcome.ts"

describe("showWelcome", (): void => {
  test("showWelcome - no client", (): void => {
    expect(showWelcome(null, {} as User, "")).rejects.toThrowError("Invalid client")
  })

  const channel: TextChannel = {
    send: jest.fn()
  } as unknown as TextChannel

  const channelManager: ChannelManager = {
    cache: new Map(),
    fetch: jest.fn().mockResolvedValue(null)
  } as unknown as ChannelManager

  const client: Client = {
    channels: channelManager
  } as unknown as Client

  test("showWelcome - no channel_id", (): void => {
    const bak: string | undefined = Bun.env.CHANNEL_ID
    Bun.env.CHANNEL_ID = undefined
    expect(showWelcome(client, {} as User, "")).rejects.toThrowError("Invalid CHANNEL_ID")
    Bun.env.CHANNEL_ID = bak
  })

  const ID_LEN: number = 19

  Bun.env.CHANNEL_ID = fake("#".repeat(ID_LEN))

  test("showWelcome - no logo", (): void => {
    const bak: string | undefined = Bun.env.LOGO_URL
    Bun.env.LOGO_URL = undefined
    expect(showWelcome(client, {} as User, "")).rejects.toThrowError("Invalid LOGO_URL")
    Bun.env.LOGO_URL = bak
  })

  test("showWelcome - no logo2", (): void => {
    const bak: string | undefined = Bun.env.LOGO2_URL
    Bun.env.LOGO2_URL = undefined
    expect(showWelcome(client, {} as User, "")).rejects.toThrowError("Invalid LOGO2_URL")
    Bun.env.LOGO2_URL = bak
  })

  test("showWelcome - no channel", (): void => {
    expect(showWelcome(client, {} as User, "")).rejects.toThrowError("Invalid channel")
  })

  test("showWelcome - pass", (): void => {
    client.channels.fetch = jest.fn().mockResolvedValue(channel)

    const user: User = {
      displayAvatarURL: jest.fn().mockReturnValue(url()),
      displayName: fullName(),
      id: fake("#".repeat(ID_LEN)),
      username: username()
    } as unknown as User

    expect(showWelcome(client, user, "TEST")).resolves
  })
})
