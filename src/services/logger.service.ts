import pino, { Logger } from "pino";

export class LoggerService {
  private logger: Logger;
  init() {
    this.logger = pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    });
  }

  info(msg: string) {
    this.logger.info(msg);
  }

  error(err: Error) {
    this.logger.error(err);
  }
}
