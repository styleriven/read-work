import { IReadingHistory } from "@models/interfaces/i-reading-history";
import { ReadingHistoryModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class ReadingHistoryRepository extends BaseRepository<IReadingHistory> {}
export default new ReadingHistoryRepository(ReadingHistoryModel);
