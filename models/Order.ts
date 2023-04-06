import { Schema, model, Types } from "mongoose";

const OrderSchema = new Schema({
  Description: {
    type: String,
  },
  Urunler: [
    {
      type: Schema.Types.ObjectId,
      ref: "OrderUrun",
      required: true,
    },
  ],
  Masaid: {
    // Productta Schema type: Schema.Types.ObjectId,
    type: Number,
    ref: "Masa",
    required: true,
  },
  Durum: {
    type: String,
    enum: ["tamamlandı", "açık"],
    default: "açık",
  },
});

export const Order = model("Order", OrderSchema);
