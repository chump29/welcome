declare module "bun" {
  interface Env {
    CHANNEL_ID: string | undefined
    DEBUG: boolean
    IS_DEBUG: string | undefined
    LOGO_URL: string | undefined
    LOGO2_URL: string | undefined
    NAME: string | undefined
    npm_package_version: string | undefined
    TOKEN: string | undefined
  }
}
