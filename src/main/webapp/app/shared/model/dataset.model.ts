import { DatasetType } from 'app/shared/model/enumerations/dataset-type.model';

export interface IDataset {
  id?: string;
  name?: string;
  type?: DatasetType;
  hasHeader?: boolean;
  headers?: string[];
  measure0?: number;
  measure1?: number;
  lat?: number;
  lon?: number;
  dataSource?: number;
  dimensions?: number[];
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  queryXMin?: number;
  queryXMax?: number;
  queryYMin?: number;
  queryYMax?: number;
  objectCount?: number;
}

export const defaultValue: Readonly<IDataset> = {};
