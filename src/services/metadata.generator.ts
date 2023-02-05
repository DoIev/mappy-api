import { IConfigurationService } from "./interfaces/configuration.interface";
import { IMetadata } from "../models/metadata.model";
import { ITimeService } from "./interfaces/time.interface";

export class MetadataGenerator {
  private defaultUser: string;
  constructor(
    private readonly configurationService: IConfigurationService,
    private readonly timeService: ITimeService
  ) {
    this.defaultUser = this.configurationService.get("defaultUser");
  }
  public generateMetadata(): IMetadata {
    const currentTime = this.timeService.getCurrentTime();
    return {
      creationTime: currentTime,
      updateTime: currentTime,
      creatingUser: this.defaultUser,
      updatingUser: this.defaultUser,
    };
  }

  public updateMetadata(metadata: IMetadata): IMetadata {
    const currentTime = this.timeService.getCurrentTime();
    return {
      ...metadata,
      updateTime: currentTime,
      updatingUser: this.defaultUser,
    };
  }
}
