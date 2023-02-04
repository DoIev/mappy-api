import { ITemplateField } from "./field.model";
import { IMetadata } from "../models/metadata.model";

export interface ITemplate {
  _id: string;
  fields: ITemplateField[];
  metadata?: IMetadata;
}
