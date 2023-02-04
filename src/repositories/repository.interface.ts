export interface IRepository<T> {
  getAll: () => Promise<T[]>;
  getByQuery: (query: any) => Promise<T[]>;
  getOneById: (id: string) => Promise<T>;
  updateOne: (newItem: T) => Promise<T>;
  deleteOneById: (id: string) => Promise<void>;
  createOne: (newItem: T) => Promise<T>;
}
