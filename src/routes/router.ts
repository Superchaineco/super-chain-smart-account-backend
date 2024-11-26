import {  Router } from "express";
import { verifyReverseProxy, verifyOwner } from "../middleware/auth";
import { getUser } from "../controllers/user";
import { claimBadges, getBadges } from "../controllers/badges";
import { perksByAccount, perksByLevel } from "../controllers/perks";
import { getBalance, relay, reverseProxy, validateSponsorship } from "../controllers/sponsor";

export const routes = Router();

routes.get("/user/:account", getUser);

routes.get("/user/:account/badges", getBadges);

routes.get("/user/:account/perks", perksByAccount);

routes.get("/perks/:level", perksByLevel);

routes.get("/user/:account/sponsorship-balance", getBalance);

routes.post("/user/:account/badges/claim", verifyOwner, claimBadges);

routes.post("/validate-sponsorship", validateSponsorship);

routes.post("/relay", relay)

routes.post("/user-op-reverse-proxy", verifyReverseProxy, reverseProxy);


export default routes;