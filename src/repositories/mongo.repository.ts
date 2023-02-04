import { IRepository } from "./repository.interface";
import {
  Db,
  Collection,
  MongoClient,
  DeleteResult,
  InsertOneResult,
  ObjectId,
} from "mongodb";
import { isEmpty } from "lodash";
import { DatabaseError } from "../errors/database.error";

export class MongoRepository<T> implements IRepository<T> {
  private client: MongoClient;
  private database: Db;
  private collection: Collection<T>;
  constructor(private readonly connectionContext: any) {}

  public async init() {
    this.client = new MongoClient(this.connectionContext.connectionString);
    await this.client.connect();
    this.database = this.client.db(this.connectionContext.databaseName);
    this.collection = this.database.collection<T>(
      this.connectionContext.collectionName
    );
  }
  public async getAll(): Promise<T[]> {
    return this.getByQuery({});
  }
  public async getByQuery(query: Object): Promise<T[]> {
    const cursor = this.collection.find(query);
    const items = await cursor.toArray();
    return items as T[];
  }
  public getOneById(id: string): Promise<T> {
    //@ts-ignore
    return this.collection.findOne<T>({ _id: new ObjectId(id) });
  }
  public updateOne(newItem: T): Promise<T> {
    //@ts-ignore
    return this.collection.updateOne<T>({ _id: new ObjectId(newItem._id) }, newItem, {upsert: true});
  }
  public async deleteOneById(id: string): Promise<void> {
    //@ts-ignore
    const deleteResult: DeleteResult = await this.collection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) throw new Error();
    return;
  }
  public async createOne(newItem: T): Promise<T> {
    const insertResult: InsertOneResult<T> = await this.collection.insertOne(
      //@ts-ignore
      newItem
    );
    const id = insertResult.insertedId.toString();
    if (isEmpty(id)) throw new Error();
    return Object.assign(newItem, { _id: id });
  }

  private _wrapMethodWithErrorBoundary(callback: () => any): any {
    try {
      return callback();
    } catch {
      throw new DatabaseError("Database Error");
    }
  }
}
