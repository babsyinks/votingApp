import { Model, DataTypes, Sequelize, Optional } from "sequelize";

import type { Models } from "./types/models";

export interface OrganizationAttributes {
  organization_id: string;
  name: string;
  description?: string;
}

export type OrganizationCreationAttributes = Optional<
  OrganizationAttributes,
  "organization_id"
>;

export class Organization
  extends Model<OrganizationAttributes, OrganizationCreationAttributes>
  implements OrganizationAttributes
{
  public organization_id!: string;
  public name!: string;
  public description?: string;

  static associate(models: Models) {
    Organization.hasMany(models.Election, { foreignKey: "organization_id" });
    Organization.belongsToMany(models.User, {
      through: models.UserOrganization,
      foreignKey: "organization_id",
      otherKey: "user_id",
    });
  }

  toJSON() {
    return this.get();
  }

  static initModel(sequelize: Sequelize) {
    Organization.init(
      {
        organization_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.TEXT },
      },
      {
        sequelize,
        modelName: "Organization",
        tableName: "organizations",
      },
    );
    return Organization;
  }
}
