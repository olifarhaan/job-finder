// models/JobApplication.js
import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema(
  {
    admin: {
      default: 'alifarhan231087@gmail.com',
      required: true,
    },
    money: {
      type: Number,
      default:0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Owner = mongoose.model("Owner", ownerSchema);

export default Owner;
