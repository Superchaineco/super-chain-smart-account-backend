import http from 'http';
import app from './app';
import * as logger from './utils/logger';
import { setupWebSocket } from './middleware/websocket';


const server = http.createServer(app);


const PORT = process.env.PORT || 3003;
setupWebSocket(server); 

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

server.setTimeout(500000);
