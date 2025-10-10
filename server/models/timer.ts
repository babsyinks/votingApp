import { Model, DataTypes, Sequelize, Optional } from "sequelize";

import type { Models } from "./types/models";

export interface TimerAttributes {
  timer_id: string;
  election_id: string;
  startDate?: Date;
  endDate?: Date;
}

export type TimerCreationAttributes = Optional<
  TimerAttributes,
  "timer_id" | "startDate" | "endDate"
>;

export class Timer
  extends Model<TimerAttributes, TimerCreationAttributes>
  implements TimerAttributes
{
  public timer_id!: string;
  public election_id!: string;
  public startDate?: Date;
  public endDate?: Date;

  static associate(models: Models) {
    Timer.belongsTo(models.Election, { foreignKey: "election_id" });
  }

  static initModel(sequelize: Sequelize) {
    Timer.init(
      {
        timer_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        election_id: { type: DataTypes.UUID, allowNull: false, unique: true },
        startDate: DataTypes.DATE,
        endDate: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "Timer",
        tableName: "timers",
        indexes: [
          {
            unique: true,
            fields: ["election_id"],
            name: "uq_timer_per_election",
          },
        ],
      },
    );
    return Timer;
  }
}
