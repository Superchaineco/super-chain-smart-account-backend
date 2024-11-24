import { Router } from "express";
import { getNonce, getSession, signOut, verifySignature } from "@/controllers/siwe";

export const authRouter = Router();

authRouter.get('/nonce', getNonce);

authRouter.post('/verify', verifySignature);

authRouter.get('/session', getSession);

authRouter.get('/signout', signOut);

export default authRouter;