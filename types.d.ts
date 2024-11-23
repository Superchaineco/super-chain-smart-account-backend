import "express-session";

declare module "express-session" {
  interface SessionData {
    siwe: {
      address: string;
      chainId: number;
    } | null;
    nonce: string | null;
  }
}
