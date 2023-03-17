import { Schema, model, Types } from "mongoose";

interface İcecekler {
  name: string;
  fiyat: number;
}
interface Menu {
  İcecekler: Types.DocumentArray<İcecekler>;
  user: Types.ObjectId;
}

const MenuSchema = new Schema({
  Name: {
    type: String,
    required: true,
  },
  Slug: {
    type: String,
    required: true,
  },
  QRCode: {
    type: String,
  },
  image: {
    type: String,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  Kategoriler: [
    {
      type: Schema.Types.ObjectId,
      ref: "Kategori",
    },
  ],
  Masalar: [
    {
      type: Schema.Types.ObjectId,
      ref: "Masa",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Menu = model("Menu", MenuSchema);
