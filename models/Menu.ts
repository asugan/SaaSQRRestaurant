const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Menu", MenuSchema);
