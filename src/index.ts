import http from 'http';
import app from './app';
import * as logger from './utils/logger';


const server = http.createServer(app);


const PORT = process.env.PORT || 3003;


server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

server.setTimeout(500000);
