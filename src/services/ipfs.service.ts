

class IpfsService {
    private gatewayUrl = 'https://silver-brilliant-meadowlark-311.mypinata.cloud'

    public async getIPFSData(CID: string): Promise<string> {
        const response = await fetch(`${this.gatewayUrl}/${CID}`)
        return await response.text()
    }
}


const ipfsService = new IpfsService()
export default ipfsService