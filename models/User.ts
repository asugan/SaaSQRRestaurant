import { Schema, model, Types } from "mongoose";
const bcrypt = require("bcryptjs");

interface User {
  username: string;
  password: string;
  verified: boolean;
  userLevel: string;
  menuLeft: number;
  email: string;
  daysLeft: Date;
  userMenu: Types.Array<Types.ObjectId>;
  created_date: Date;
}

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userLevel: {
    type: String,
    required: true,
    enum: ["Maraba", "Deneme", "Abone"],
    default: "Deneme",
  },
  menuLeft: {
    type: Number,
    required: true,
    default: 1,
  },
  daysLeft: {
    type: Date,
    required: true,
    default: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
  },
  userMenu: [
    {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
  ],
  created_date: { type: Date, required: true, default: new Date().getTime() },
});

userSchema.pre("save", function (next: any) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError: any, salt: any) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError: any, hash: any) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

export const User = model<User>("User", userSchema);
