import { PrivyClient } from "@privy-io/server-auth";
import { PRIVY_APP_ID, PRIVY_APP_SECRET } from "../config/superChain/constants";
import axios from "axios";

class PrivyService {
  private privyClient: PrivyClient;

  constructor() {
    this.privyClient = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);
  }

  async verifyAuthToken(token: string) {
    try {
      return this.privyClient.verifyAuthToken(token);
    } catch (e) {
      return null;
    }
  }
  async getUserInfo(userID: string) {
    try {
      const response = await axios.get(
        `https://auth.privy.io/api/v1/users/${userID}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString("base64")}`,
            "privy-app-id": PRIVY_APP_ID,
          },
        },
      );
      return response.data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

const privyService = new PrivyService();
export default privyService;
