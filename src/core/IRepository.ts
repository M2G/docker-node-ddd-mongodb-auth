import type {
 Document,
  Model,
  UpdateQuery,
  Query,
  Types,
} from "mongoose";

export interface IRead<T extends Document> {
  retrieve: (callback: (error: any, result: any) => void) => void;
  findById: (id: string, callback: (error: any, result?: Model<T>) => void) => void;
  findOne: ((conditions: any, projection: any,
             callback?: (err: any, res: Model<T> | null) => void) => Query<T | null, T>)
    & ((conditions: any, projection: any, options: any,
        callback?: (err: any, res: Model<T> | null) => void) => Query<T | null, T>)
    & ((conditions?: any,
        callback?: (err: any, res: Model<T> | null) => void) => Query<T | null, T>);

  find: ((callback?: (err: any, res?: Model<T>[]) => void) => Query<T[], T>)
    & ((conditions: any, callback?: (err: any, res?: Model<T>[]) => void) => Query<T[], T>)
    & ((conditions: any, projection?: any | null,
        callback?: (err: any, res?: T[]) => void) => Query<T[], T>)
    & ((conditions: any, projection?: any | null, options?: any | null,
       callback?: (err: any, res?: Model<T>[]) => void) => Query<T[], T>);
}

export interface IWrite<T extends Document> {
  // create: (item: CreateQuery<T>, callback: (error: any, result: T[]) => void) => void;
  create: ((item?: Query<any[], any, {}, any>,
            callback?: (error: any, result?: T[]) => void) => Query<T[], T>);
  update: (_id?: Types.ObjectId, item?: UpdateQuery<T>,
           callback?: (error: any, result: any) => void) => void;
  findByIdAndUpdate: (_id: string, callback: (error: any, result: any) => void) => void;
  findByIdAndDelete: (_id: string, callback: (error: any, result: any) => void) => void;
}
