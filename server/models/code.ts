import { Model, DataTypes, Sequelize, Optional } from "sequelize";

export interface CodeAttributes {
  code_id: string;
  codeHash: string;
  email: string;
  type: "signup" | "password_reset" | "email_change";
  expiresAt: Date;
}

export type CodeCreationAttributes = Optional<CodeAttributes, "code_id">;

export class Code
  extends Model<CodeAttributes, CodeCreationAttributes>
  implements CodeAttributes
{
  public code_id!: string;
  public codeHash!: string;
  public email!: string;
  public type!: "signup" | "password_reset" | "email_change";
  public expiresAt!: Date;

  toJSON() {
    return this.get();
  }

  static initModel(sequelize: Sequelize) {
    Code.init(
      {
        code_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        codeHash: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        type: {
          type: DataTypes.ENUM("signup", "password_reset", "email_change"),
          allowNull: false,
        },
        expiresAt: { type: DataTypes.DATE, allowNull: false },
      },
      {
        sequelize,
        modelName: "Code",
        tableName: "codes",
      },
    );
    return Code;
  }
}
