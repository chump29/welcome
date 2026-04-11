declare module "bun" {
  interface Env {
    CHANNEL_ID: string;
    DEBUG: boolean;
    npm_package_version: string;
    SERVER_NAME: string;
    TOKEN: string;
    WELCOME_IMAGE_URL: string;
  }
}
