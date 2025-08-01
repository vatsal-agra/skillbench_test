import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export class Question extends Model {
  public id!: number;
  public course_id!: string;
  public text!: string;
  public options!: string[];
  public correct_index!: number;
  public explanation?: string;
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
    correct_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Question",
    tableName: "questions",
    timestamps: true,
  }
);
