export interface IConfigurationService {
  init: () => void;
  getAll: () => Record<string, string>;
  get: (key: string) => string;
  set: (key: string, value: string) => void;
}
