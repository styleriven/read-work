import connectDB from "@/lib/mongodb";
import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { v4 } from "uuid";

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  protected async ensureConnection(): Promise<void> {
    await connectDB();
  }

  async create(data: Partial<T>): Promise<T> {
    await this.ensureConnection();
    if (data._id === undefined) {
      data._id = v4();
    }
    const doc = new this.model(data);
    return doc.save();
  }

  async findById(_id: string): Promise<T | null> {
    await this.ensureConnection();
    return this.model.findOne({ _id, deletedAt: null }).exec();
  }

  async findByIds(
    ids: string[],
    filter: Partial<T> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    await this.ensureConnection();
    const combinedFilter = {
      _id: { $in: ids },
      deletedAt: null,
      ...(filter as FilterQuery<T>),
    };
    const totalCount = await this.model.countDocuments(combinedFilter).exec();

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const data = await this.model
      .find(combinedFilter)
      .skip(skip)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(totalCount / limit);

    return { data, totalCount, totalPages, currentPage: page };
  }

  async find(filter: Partial<T>): Promise<T | null> {
    await this.ensureConnection();
    return (await this.model
      .findOne({ deletedAt: null, ...(filter as FilterQuery<T>) })
      .exec()) as T | null;
  }

  async findAll(
    filter: Partial<T> = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    await this.ensureConnection();
    const combinedFilter = { deletedAt: null, ...(filter as FilterQuery<T>) };
    const totalCount = await this.model.countDocuments(combinedFilter).exec();

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const data = await this.model
      .find(combinedFilter)
      .skip(skip)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil(totalCount / limit);

    return { data, totalCount, totalPages, currentPage: page };
  }

  async update(
    _id: string,
    updateData: UpdateQuery<T>,
    filter: Partial<T> = {}
  ): Promise<T | null> {
    await this.ensureConnection();
    return this.model
      .findOneAndUpdate(
        { _id, deletedAt: null, ...(filter as FilterQuery<T>) },
        updateData,
        { new: true }
      )
      .exec();
  }

  async updateMany(
    data: {
      _id: string;
      updateData: UpdateQuery<T>;
      filter?: Partial<T>;
    }[]
  ): Promise<number> {
    if (data.length === 0) return 0;
    await this.ensureConnection();

    const ops = data.map((item) => ({
      updateOne: {
        filter: {
          _id: item._id,
          deletedAt: null,
          ...((item.filter ?? {}) as FilterQuery<T>),
        },
        update: { $set: item.updateData },
      },
    }));

    const result = await this.model.bulkWrite(ops);
    return result.modifiedCount;
  }

  async delete(_id: string): Promise<boolean> {
    await this.ensureConnection();
    const result = await this.model
      .findOneAndUpdate(
        { _id, deletedAt: null },
        { deletedAt: new Date() },
        { new: true }
      )
      .exec();
    return !!result;
  }

  async deleteMany(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;
    await this.ensureConnection();

    const ops = ids.map((_id) => ({
      updateOne: {
        filter: { _id, deletedAt: null },
        update: { $set: { deletedAt: new Date() } },
      },
    }));

    const result = await this.model.bulkWrite(ops);
    return result.modifiedCount;
  }

  async destroy(filter: Partial<T>): Promise<number> {
    await this.ensureConnection();
    const result = await this.model.deleteMany(filter as FilterQuery<T>).exec();
    return result.deletedCount || 0;
  }
}
