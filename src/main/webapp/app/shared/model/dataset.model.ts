import { IField } from 'app/shared/model/field.model';
import { DatasetType } from 'app/shared/model/enumerations/dataset-type.model';

export interface IDataset {
  id?: number;
  name?: string;
  type?: DatasetType;
  measure0?: IField;
  measure1?: IField;
  lat?: IField;
  lon?: IField;
  dimensions?: IField[];
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
