import http from 'http';
import { config } from 'dotenv';
import app from './app';
import * as logger from './utils/logger';

if (process.env.NODE_ENV !== 'production') {
  config();
}
const server = http.createServer(app);

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
