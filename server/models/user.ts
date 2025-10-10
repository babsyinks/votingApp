import { Model, DataTypes, Sequelize, Optional } from "sequelize";

import type { Models } from "./types/models";

export interface UserAttributes {
  user_id: string;
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  isAdmin: boolean;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  "user_id" | "isAdmin"
>;

export type UserAttributesWithRoles = UserAttributes & {
  role: "admin" | "user";
};

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public user_id!: string;
  public username!: string;
  public password!: string;
  public email!: string;
  public firstname!: string;
  public lastname!: string;
  public isAdmin!: boolean;

  static associate(models: Models) {
    User.belongsToMany(models.Organization, {
      through: models.UserOrganization,
      foreignKey: "user_id",
      otherKey: "organization_id",
    });
    User.hasMany(models.Votes, { foreignKey: "user_id" });
  }

  // Override toJSON for cleaner output
  public toJSON(): UserAttributesWithRoles {
    const attributes: UserAttributes = { ...this.get() } as UserAttributes;
    return {
      ...attributes,
      // role is set to admin or user initially. When user wants to access an organization resource,
      // the role of the user is determined at the organization level using the userOrganization
      // model to determine if the user is a member (if so what role do they have there) or not.
      role: this.isAdmin ? "admin" : "user",
    };
  }

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        user_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        firstname: { type: DataTypes.STRING, allowNull: false },
        lastname: { type: DataTypes.STRING, allowNull: false },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
        indexes: [{ fields: ["username"] }, { fields: ["email"] }],
      },
    );
    return User;
  }
}
