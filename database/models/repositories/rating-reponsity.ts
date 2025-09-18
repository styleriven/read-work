import { IRating } from "@models/interfaces/i-rating";
import { RatingModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class RatingRepository extends BaseRepository<IRating> {}
export default new RatingRepository(RatingModel);
