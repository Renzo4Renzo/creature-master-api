const mongoose = require("mongoose");

const cardsSchema = new mongoose.Schema(
  {
    // id: {
    //   type: String,
    //   required: true,
    // },
    type: {
      type: String,
      enum: { values: ["Creature", "Field Boost", "Quick Boost"], message: "{VALUE} is not a valid type" },
      required: [true, "type is required"],
    },
    name: {
      type: String,
      minLength: [3, "name should have at least 3 characters"],
      match: [
        /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/,
        "name can only contain numbers and letters, with only one white space between words",
      ],
      required: [true, "name is required"],
    },
    imageUrl: {
      type: String,
      match: [
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
        "imageUrl is not filled in url format",
      ],
      required: [true, "imageUrl is required"],
    },
    description: {
      type: String,
      minLength: [3, "description should have at least 3 characters"],
      match: [
        /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/,
        "description can only contain numbers and letters, with only one white space between words",
      ],
      required: [true, "description is required"],
    },
    guild: {
      type: String,
      match: [
        /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/,
        "guild can only contain numbers and letters, with only one white space between words",
      ],
      minLength: [4, "guild should have at least 4 characters"],
      required: [
        function () {
          return this.type === "Creature";
        },
        `guild is needed on Creature Cards!`,
      ],
    },
    trait: {
      type: String,
      enum: {
        values: ["Charismatic", "Committed", "Witty", "Smart", "Brave", "Patient"],
        message: "{VALUE} is not a valid trait",
      },
      required: [
        function () {
          return this.type === "Creature";
        },
        `trait is needed on Creature Cards!`,
      ],
    },
    weight: {
      type: String,
      enum: { values: ["Light", "Average", "Heavy"], message: "{VALUE} is not a valid weight" },
      required: [
        function () {
          return this.type === "Creature";
        },
        `weight is needed on Creature Cards!`,
      ],
    },
    lifePoints: {
      type: Number,
      min: [0, "lifePoints should be a positive value"],
      required: [
        function () {
          return this.type === "Creature";
        },
        `lifePoints is needed on Creature Cards!`,
      ],
    },
    turns: {
      type: Number,
      min: [2, "Field Boosts should at least work for 2 turns"],
      required: [
        function () {
          return this.type === "Field Boost";
        },
        `turns is needed on Field Boost Cards!`,
      ],
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Card", cardsSchema);
