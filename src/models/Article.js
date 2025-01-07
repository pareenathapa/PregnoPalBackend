const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  author: { type: String, required: true },
  published_date: { type: Date, required: true, default: Date.now },
  title: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  article_cover: { type: String },
  author_image: { type: String },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
