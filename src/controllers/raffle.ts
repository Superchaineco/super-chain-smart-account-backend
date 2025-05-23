
import { TURNSTILE_RAFFLE_SECRET_KEY } from '@/config/superChain/constants';
import { Request, Response } from 'express';

export async function raffleClaim(req: Request, res: Response) {


    const tokenFromFrontend = req.body.claimKey;
    const ipAddress = req.ip;
    let isHuman = false
    if (tokenFromFrontend) {
        const captchaRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: TURNSTILE_RAFFLE_SECRET_KEY!,
                response: tokenFromFrontend,
                remoteip: ipAddress,
            }),
        });

        const data = await captchaRes.json();

        isHuman = data.success
    }


}