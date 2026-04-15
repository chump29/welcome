declare module "bun" {
  interface Env {
    CHANNEL_ID: string
    DEBUG: boolean
    IS_DEBUG: string
    LOGO_PORT: string
    LOGO_SERVER: string
    LOGO_URL: string
    NAME: string
    npm_package_version: string
    RATE: string
    TOKEN: string
    WELCOME_IMAGE_URL: string
  }
}
