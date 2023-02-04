import { IMetadata } from "./metadata.model";

export interface ITemplateField {
  displayName: string;
  type: IFieldType;
  fieldId: string;
}

export interface IEntityField {
  fieldId: string;
  value: string;
  metadata?: IMetadata;
}

export enum IFieldType {
  String = "String",
  Date = "Date",
  Geography = "Geography",
  StringArray = "StringArray",
}
