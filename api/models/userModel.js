// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['student', 'company'],
      required: true,
    },
    rupees: {
      type: Number,
      default: 0,
    },
    // Add other fields as needed
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
