import { Schema, model, Types } from "mongoose";

interface Menu {
  İcecekler: [{ name: string; fiyat: number }];
  user: Types.ObjectId;
}

const MenuSchema = new Schema<Menu>({
  İcecekler: [
    {
      name: {
        type: String,
        required: true,
      },
      fiyat: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Menu = model<Menu>("Menu", MenuSchema);
