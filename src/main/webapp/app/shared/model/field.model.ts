import { IDataset } from 'app/shared/model/dataset.model';

export interface IField {
  id?: number;
  name?: string;
  fieldIndex?: number;
  dataset?: IDataset;
}

export const defaultValue: Readonly<IField> = {};
