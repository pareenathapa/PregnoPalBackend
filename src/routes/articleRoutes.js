const express = require("express");
const Article = require("../models/Article");
const { protect } = require("../utils/auth");

const router = express.Router();

// Create Article (Protected)
router.post("/", protect, async (req, res) => {
  const { author, title, content, author_image, article_cover } = req.body;

  try {
    const article = new Article({
      author,
      title,
      content,
      author_image,
      article_cover,
      published_date: Date.now(),
    });

    await article.save();
    res.status(201).json({ message: "Article created", article });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Articles
router.get("/", protect, async (req, res) => {
  const { sort } = req.query; // Accept 'sort' query parameter

  try {
    let articles;

    switch (sort) {
      case "alphabetical":
        articles = await Article.find().sort({ title: 1 }); // Sort by title (A-Z)
        break;
      case "newest":
        articles = await Article.find().sort({ published_date: -1 }); // Sort by newest first
        break;
      case "oldest":
        articles = await Article.find().sort({ published_date: 1 }); // Sort by oldest first
        break;
      default:
        articles = await Article.find(); // No specific sorting
    }

    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// Get Single Article
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Article (Protected)
router.put("/:id", protect, async (req, res) => {
  const { title, content } = req.body;

  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { title, content, updated_at: Date.now() },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(201).json({ message: "Article updated", article });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Article (Protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
