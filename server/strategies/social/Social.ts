import bcrypt from "bcryptjs";
import type { Profile } from "passport";
import type { DoneCallback } from "passport";
import { v4 as uuidv4 } from "uuid";

import { User } from "../../models";

class Social {
  protected profile: Profile;
  protected strategy: string;
  protected namesCombined: boolean;

  constructor(profile: Profile, strategy = "Social", namesCombined = true) {
    this.profile = profile;
    this.strategy = strategy;
    this.namesCombined = namesCombined;
  }

  async authenticate(done: DoneCallback): Promise<void> {
    try {
      const email = this.__extractEmail();
      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await this.__createUser(email);
      }

      return done(null, user);
    } catch (err) {
      return done(err as Error, null);
    }
  }

  private async __createUser(email: string): Promise<User> {
    const { firstname, lastname } = this.__extractFirstAndLastNames();
    return await User.create({
      user_id: uuidv4(),
      username: this.profile.username || email,
      email,
      password: await bcrypt.hash(uuidv4(), 10),
      firstname,
      lastname,
      isAdmin: false,
    });
  }

  private __extractEmail(): string {
    return (
      this.profile.emails?.[0]?.value ||
      `${this.profile.id}@${this.strategy}.com`
    );
  }

  private __extractFirstAndLastNames(): {
    firstname: string;
    lastname: string;
  } {
    return this.namesCombined
      ? this.__extractNamesFromProfileDisplayNameProp()
      : this.__extractNamesFromProfileNameProp();
  }

  private __extractNamesFromProfileNameProp(): {
    firstname: string;
    lastname: string;
  } {
    return {
      firstname:
        this.profile.name?.givenName ||
        this.__capitalizeFirstLetterOfStrategy(),
      lastname: this.profile.name?.familyName || "User",
    };
  }

  private __extractNamesFromProfileDisplayNameProp(): {
    firstname: string;
    lastname: string;
  } {
    const names = this.profile.displayName?.split(" ");
    const firstname = names?.[0] || this.__capitalizeFirstLetterOfStrategy();
    const lastname = names?.[1] || "User";
    return { firstname, lastname };
  }

  private __capitalizeFirstLetterOfStrategy(): string {
    return `${this.strategy.charAt(0).toUpperCase()}${this.strategy.slice(1)}`;
  }
}

export default Social;
