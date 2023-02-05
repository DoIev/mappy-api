import pino, { Logger } from "pino";

export class LoggerService {
  private logger: Logger;
  public init() {
    this.logger = pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
      },
    });
  }

  public info(msg: string) {
    this.logger.info(msg);
  }

  public error(err: Error) {
    this.logger.error(err);
  }
}
