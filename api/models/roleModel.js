// models/Role.js
import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    roleName: {
      type: String,
      required: true,
    },
    minCTC: {
      type: Number,
      required: true,
    },
    maxCTC: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    requiredRupees: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
