const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const { User } = require("../../models");

class Social {
  constructor(profile, strategy, namesCombined = true) {
    this.profile = profile;
    this.strategy = strategy || "Social";
    this.namesCombined = namesCombined;
  }

  async authenticate(done) {
    try {
      const email = this.__extractEmail();
      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await this.__createUser(email);
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }

  async __createUser(email) {
    const { firstname, lastname } = this.__extractFirstAndLastNames();
    return await User.create({
      user_id: uuidv4(),
      username: this.profile.username || email.split("@")[0],
      email,
      password: await bcrypt.hash(uuidv4(), 10), // unused placeholder
      firstname,
      lastname,
      role: "user",
    });
  }

  __extractEmail() {
    return (
      this.profile.emails?.[0]?.value ||
      `${this.profile.id}@${this.strategy}.com`
    );
  }

  __extractFirstAndLastNames() {
    if (this.namesCombined) {
      return this.__extractNamesFromProfileDisplayNameProp();
    } else {
      return this.__extractNamesFromProfileNameProp();
    }
  }

  __extractNamesFromProfileNameProp() {
    return {
      firstname:
        this.profile.name?.givenName ||
        this.__capitalizeFirstLetterOfStrategy(),
      lastname: this.profile.name?.familyName || "User",
    };
  }

  __extractNamesFromProfileDisplayNameProp() {
    const names = this.profile.displayName?.split(" ");
    const firstname = names?.[0] || this.__capitalizeFirstLetterOfStrategy();
    const lastname = names?.[1] || "User";
    return { firstname, lastname };
  }

  __capitalizeFirstLetterOfStrategy() {
    return `${this.strategy.charAt(0).toUpperCase()}${this.strategy.slice(1)}`;
  }
}

module.exports = Social;
