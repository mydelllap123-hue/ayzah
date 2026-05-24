const mongoose = require('mongoose');

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/pickle-store');
    console.log("Connected to Mongo!");
    
    const categorySchema = new mongoose.Schema({}, { strict: false });
    const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
    
    const categories = await Category.find({});
    console.log("ALL CATEGORIES IN DB:", JSON.stringify(categories, null, 2));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

main();
