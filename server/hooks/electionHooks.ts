const slugify = require("slugify");
const { nanoid } = require("nanoid");
const logger = require("../utils/logger");

module.exports = {
  async beforeCreate(election, options) {
    if (!election.slug) {
      election.slug = slugify(election.name, { lower: true, strict: true });
    }
    if (!election.short_link) {
      election.short_link = `${process.env.CLIENT_URL}/${nanoid(8)}`;
    }
  },

  async afterCreate(election, options) {
    logger.info(`Election created: ${election.slug}, short link: ${election.short_link}`);
  },
};
