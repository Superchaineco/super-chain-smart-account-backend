import "express-session";

declare module "express-session" {
  interface SessionData {
    siwe: {
      address: string;
      chainId: string;
    } | null;
    nonce: string | null;
  }
}
