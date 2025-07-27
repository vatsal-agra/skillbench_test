import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface QuestionAttributes {
  id?: number;
  course_id: string;
  text: string;
  options: string[];
  correct_index: number;
  explanation?: string;
  created_at?: Date;
  updated_at?: Date;
}

class Question extends Model<QuestionAttributes> implements QuestionAttributes {
  public id!: number;
  public course_id!: string;
  public text!: string;
  public options!: string[];
  public correct_index!: number;
  public explanation?: string;
  public created_at?: Date;
  public updated_at?: Date;
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
    tableName: 'questions',
    timestamps: true,
    underscored: true,
  }
);

export default Question;
