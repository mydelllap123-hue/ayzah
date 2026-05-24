import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

/**
 * Recalculates and updates the average rating and review count of a product.
 * @param productId - The MongoDB ObjectId of the product
 */
export async function updateProductRating(productId: string) {
  try {
    await connectDB();
    
    // Find all approved reviews for this product
    const reviews = await Review.find({ product: productId, status: "approved" });
    const totalCount = reviews.length;
    
    // Calculate average rating, default to 4.8 if there are no reviews yet
    const avgRating = totalCount > 0 
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount) * 10) / 10 
      : 4.8;

    // Update Product document
    await Product.findByIdAndUpdate(productId, {
      ratings: avgRating,
      reviews: totalCount
    });

    console.log(`⭐ Product ${productId} rating updated to ${avgRating} (${totalCount} reviews)`);
  } catch (error) {
    console.error("Failed to update product rating:", error);
  }
}
