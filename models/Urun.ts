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
  Nameen: {
    type: String,
  },
  Nameru: {
    type: String,
  },
  Namefr: {
    type: String,
  },
  Description: {
    type: String,
  },
  Descriptionen: {
    type: String,
  },
  Descriptionru: {
    type: String,
  },
  Descriptionfr: {
    type: String,
  },
  Price: {
    type: Number,
  },
  image: {
    type: String,
  },
  Kategori: {
    type: Schema.Types.ObjectId,
    ref: "Kategori",
    required: true,
  },
});

export const Urun = model("Urun", UrunSchema);
