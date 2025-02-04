import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

const clients = new Map<string, WebSocket>();

export const setupWebSocket = (server: Server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket, req) => {
        console.log('🔌 Nuevo cliente WebSocket conectado');


        ws.once('message', (message) => {
            try {
                const { address } = JSON.parse(message.toString());
                if (address) {
                    clients.set(address, ws);
                    console.log(`✅ User: ${address}`);

                    ws.on('close', () => {
                        clients.delete(address);
                        console.log(`❌ User ${address} disconnected`);
                    });
                }
            } catch (error) {
                console.error('❌ Error:', error);
                ws.close();
            }
        });
    });


};


export const sendToUser = (address: string, data: string) => {
    const ws = clients.get(address);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ message: data }));
        console.log(`📩 Enviado sending update to ${address}`);
    }
};
