import {
  Contestants,
  ContestantsAttributes,
  ContestantsCreationAttributes,
} from "../models/contestants";

export const createContestantsService = (
  ContestantsModel: typeof Contestants,
) => {
  return {
    /**
     * Add a new contestant.
     *
     * @param contestantData - Data used to create the new contestant
     * @returns The newly created contestant record
     */
    async createContestant(
      contestantData: ContestantsCreationAttributes,
    ): Promise<Contestants> {
      return ContestantsModel.create(contestantData);
    },

    /**
     * Find contestant by ID.
     *
     * @param contestant_id - ID of the contestant to find
     * @returns The contestant record as a plain object, or undefined if not found
     */
    async findContestantById(
      contestant_id: string,
    ): Promise<ContestantsAttributes | undefined> {
      const contestant = await ContestantsModel.findOne({
        where: { contestant_id },
      });
      return contestant?.toJSON() as ContestantsAttributes | undefined;
    },

    /**
     * Fetch all contestants.
     *
     * @returns A list of all contestants as plain objects
     */
    async getAllContestants(): Promise<ContestantsAttributes[]> {
      const contestants = await ContestantsModel.findAll();
      return contestants.map(
        (contestant) => contestant.toJSON() as ContestantsAttributes,
      );
    },
  };
};

export type ContestantsService = ReturnType<typeof createContestantsService>;
export default createContestantsService;
