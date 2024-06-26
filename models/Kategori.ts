import { Schema, model, Types } from "mongoose";

interface İcecekler {
  name: string;
  fiyat: number;
}
interface Menu {
  İcecekler: Types.DocumentArray<İcecekler>;
  user: Types.ObjectId;
}

const KategoriSchema = new Schema({
  Nametr: {
    type: String,
  },
  Nameen: {
    type: String,
  },
  Nameru: {
    type: String,
  },
  Namefr: {
    type: String,
  },
  image: {
    type: String,
  },
  Urunler: [
    {
      type: Schema.Types.ObjectId,
      ref: "Urun",
    },
  ],
  Menu: {
    type: Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
});

export const Kategori = model("Kategori", KategoriSchema);
