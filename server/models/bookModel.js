import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Book = sequelize.define(
  "Book",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ISBN: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    readStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userRating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 5,
      },
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
  }
);

export default Book;
