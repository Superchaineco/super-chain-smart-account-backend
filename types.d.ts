import { UserProfile } from "../index.types";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserProfile;
    wallet?: { address: string };
  }
}
