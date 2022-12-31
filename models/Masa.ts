import { Schema, model, Types } from "mongoose";

const MasaSchema = new Schema({
  Number: {
    type: Number,
  },
  Orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  Menu: {
    type: Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
});

export const Masa = model("Masa", MasaSchema);
