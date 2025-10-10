import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export interface UserOrganizationAttributes {
  user_id: string;
  organization_id: string;
  role: "user" | "election-manager";
}

export type UserOrganizationCreationAttributes = Optional<
  UserOrganizationAttributes,
  "role"
>;

export class UserOrganization
  extends Model<UserOrganizationAttributes, UserOrganizationCreationAttributes>
  implements UserOrganizationAttributes
{
  public user_id!: string;
  public organization_id!: string;
  public role!: "user" | "election-manager";

  toJSON() {
    return this.get();
  }

  static initModel(sequelize: Sequelize) {
    UserOrganization.init(
      {
        user_id: { type: DataTypes.UUID, allowNull: false },
        organization_id: { type: DataTypes.UUID, allowNull: false },
        role: {
          type: DataTypes.ENUM("user", "election-manager"),
          allowNull: false,
          defaultValue: "user",
        },
      },
      {
        sequelize,
        modelName: "UserOrganization",
        tableName: "user_organizations",
        indexes: [
          {
            unique: true,
            fields: ["user_id", "organization_id"],
            name: "uq_user_org_membership",
          },
        ],
      },
    );
    return UserOrganization;
  }
}
