import { IEntityField } from "./field.model";

export interface IEntity {
  _id: string;
  templateId: string;
  fields: IEntityField[];
}
