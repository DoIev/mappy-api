export interface ILoggerService {
  init: () => void;
  info: (obj: any) => void;
  error: (obj: any) => void;
}
