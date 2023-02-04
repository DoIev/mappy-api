import { IConfigurationService } from "./interfaces/configuration.interface";
import { Configuration } from "../models/configuration.model";
import JSONconfiguration from "../configuration.json";
import dotenv, { DotenvConfigOutput } from "dotenv";

export class ConfigurationService implements IConfigurationService {
  constructor(private readonly configuration: Configuration) {}
  public init() {
    const dotenvConfig: DotenvConfigOutput = dotenv.config();
    Object.assign(this.configuration, JSONconfiguration, dotenvConfig.parsed);
    console.log(this.configuration);
  }
  public getAll(): Configuration {
    return this.configuration;
  }
  public get(key: string): string {
    return this.configuration[key];
  }
  public set(key: string, value: string) {
    this.configuration[key] = value;
  }
}
