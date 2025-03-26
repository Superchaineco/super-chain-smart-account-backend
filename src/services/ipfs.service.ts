class IpfsService {
  private gatewayUrl = 'https://ipfs.io';

  public async getIPFSData(CID: string): Promise<string> {
    const response = await fetch(`${this.gatewayUrl}/${CID}`);
    return await response.text();
  }
}

const ipfsService = new IpfsService();
export default ipfsService;
