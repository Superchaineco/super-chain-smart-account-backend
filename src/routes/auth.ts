import { Router } from "express";
import { generateNonce } from 'siwe';
import {
    verifySignature,
    getAddressFromMessage,
    getChainIdFromMessage,
  } from '@reown/appkit-siwe'
import { WC_PROJECT_ID as projectId} from "../config/superChain/constants";

export const authRouter = Router();

authRouter.get('/nonce', function (_, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(generateNonce());
});

authRouter.post('/verify', async (req, res) => {
    try {
      if (!req.body.message) {
        return res.status(400).json({ error: 'SiweMessage is undefined' });
      }
      
      const message = req.body.message;
      const address = getAddressFromMessage(message);
      const chainId = getChainIdFromMessage(message);

      
      const isValid = await verifySignature({
        address,
        message,
        signature: req.body.signature ,
        chainId,
        projectId,
      });
      if (!isValid) {
        throw new Error('Invalid signature');
      }
      req.session.siwe = { address, chainId };
      req.session.save(() => res.status(200).send(true));

    } catch (e: any) {
      req.session.siwe = null;
      req.session.nonce = null;
      req.session.save(() => res.status(500).json({ message: e.message }));
    }
  });


 authRouter.get('/session', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(req.session.siwe);
  });  

export default authRouter;