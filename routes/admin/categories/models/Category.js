const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  category: { type: String, unique: true, lowercase: true, required: true }
});

module.exports = mongoose.model('Category', CategorySchema);
