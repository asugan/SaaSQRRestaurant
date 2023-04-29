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
  NativeLang: {
    type: String,
    required: true,
    enum: ["tr", "en", "ru", "fr"],
    default: "tr",
  },
  Currency: {
    type: String,
    required: true,
    enum: ["₺", "$", "€"],
    default: "₺",
  },
  Slug: {
    type: String,
    required: true,
    unique: true,
  },
  QRCode: {
    type: String,
  },
  image: {
    type: String,
  },
  Kategoriler: [
    {
      type: Schema.Types.ObjectId,
      ref: "Kategori",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Menu = model("Menu", MenuSchema);
