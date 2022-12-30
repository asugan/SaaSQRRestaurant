import { Schema, model, Types } from "mongoose";
const bcrypt = require("bcryptjs");

interface User {
  username: string;
  password: string;
  userLevel: string;
  daysLeft: number;
  userMenu: Types.Array<Types.ObjectId>;
  created_date: string;
}

const userSchema = new Schema<User>({
  username: {
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
    enum: ["Deneme", "Abone", "Satıcı"],
    default: "Deneme",
  },
  daysLeft: {
    type: Number,
    required: true,
    default: 14,
  },
  userMenu: [
    {
      type: Schema.Types.ObjectId,
      ref: "Menu",
    },
  ],
  created_date: { type: String },
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
