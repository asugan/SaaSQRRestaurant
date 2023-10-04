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
  Nametr: {
    type: String,
  },
  Currency: {
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
  Descriptiontr: {
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
  Allergen: {
    type: [String],
  },
  Kategori: {
    type: Schema.Types.ObjectId,
    ref: "Kategori",
    required: true,
  },
});

export const Urun = model("Urun", UrunSchema);
