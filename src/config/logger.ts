import pino, { Logger as PinoLogger } from 'pino';
import dotenv from 'dotenv';

dotenv.config();

function createLogger(): PinoLogger {
  return pino({
    level: 'trace',
    base: null, // aqui apaga alguns campos do JSON
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
      msg: (msg: string) => ({ msg }),
    },
  });
}
const logger = createLogger();

export default logger;
