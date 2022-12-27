import { Schema, model, Types } from "mongoose";

interface İcecekler {
  name: string;
  fiyat: number;
}
interface Menu {
  İcecekler: Types.DocumentArray<İcecekler>;
  user: Types.ObjectId;
}

const UrunSchema = new Schema({
  Name: {
    type: String,
  },
  Price: {
    type: Number,
  },
  Kategori: {
    type: Schema.Types.ObjectId,
    ref: "Kategori",
    required: true,
  },
});

export const Urun = model("Urun", UrunSchema);
