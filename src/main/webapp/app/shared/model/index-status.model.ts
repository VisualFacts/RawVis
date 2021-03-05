export interface IIndexStatus {
  isInitialized: boolean;
  objectsIndexed: number;
}

export const defaultValue: Readonly<IIndexStatus> = {
  isInitialized: false,
  objectsIndexed: 0,
};
