import { nanoid } from "nanoid";
import slugify from "slugify";

import type { ElectionAttributes } from "../models/election";
import logger from "../utils/logger";

const electionHooks = {
  async beforeCreate(election: ElectionAttributes): Promise<void> {
    if (!election.slug) {
      election.slug = slugify(election.name, { lower: true, strict: true });
    }

    if (!election.short_link) {
      election.short_link = `${process.env.CLIENT_URL}/${nanoid(8)}`;
    }
  },

  async afterCreate(election: ElectionAttributes): Promise<void> {
    logger.info(
      `Election created: ${election.slug}, short link: ${election.short_link}`,
    );
  },
};

export default electionHooks;
