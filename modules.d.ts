declare module "bun" {
  interface Env {
    CHANNEL_ID: string
    DEBUG: boolean
    LOGO_PORT: number
    LOGO_SERVER: boolean
    LOGO_URL: string
    npm_package_version: string
    RATE: number
    TOKEN: string
    WELCOME_IMAGE_URL: string
  }
}
