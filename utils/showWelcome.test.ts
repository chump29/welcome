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

  test("showWelcome - no channel", (): void => {
    const channelManager: ChannelManager = {
      fetch: jest.fn().mockResolvedValue(null)
    } as unknown as ChannelManager

    const client: Client = {
      channels: channelManager
    } as unknown as Client

    expect(showWelcome(client, {} as User, "")).rejects.toThrowError("Invalid channel")
  })

  test("showWelcome - pass", (): void => {
    const ID_LEN: number = 19

    const user: User = {
      displayAvatarURL: jest.fn().mockReturnValue(url()),
      displayName: fullName(),
      id: fake("#".repeat(ID_LEN)),
      username: username()
    } as unknown as User

    const channel: TextChannel = {
      send: jest.fn()
    } as unknown as TextChannel

    const channelManager: ChannelManager = {
      cache: new Map([
        [
          channel.id,
          channel
        ]
      ]),
      fetch: jest.fn().mockResolvedValue(channel)
    } as unknown as ChannelManager

    const client: Client = {
      channels: channelManager
    } as Client

    expect(showWelcome(client, user, "TEST")).resolves
  })
})
