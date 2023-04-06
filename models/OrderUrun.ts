import { Schema, model, Types } from "mongoose";

const OrderUrunSchema = new Schema({
  Urun: {
    type: Schema.Types.ObjectId,
    ref: "Urun",
    required: true,
  },
  Adet: {
    type: Number,
    required: true,
  },
  Order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
});

export const OrderUrun = model("OrderUrun", OrderUrunSchema);
