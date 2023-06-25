import { Schema, model, Types } from "mongoose";

const PostSchema = new Schema({
  Title: {
    type: String,
    required: true,
  },
  Desc: {
    type: String,
    required: true,
  },
  Urlen: {
    type: String,
  },
  Urltr: {
    type: String,
  },
  Urles: {
    type: String,
  },
  Urlfr: {
    type: String,
  },
  Body: {
    type: String,
    required: true,
  },
  Language: {
    type: String,
  },
  Image: {
    type: String,
  },
});

export const Post = model("Post", PostSchema);
