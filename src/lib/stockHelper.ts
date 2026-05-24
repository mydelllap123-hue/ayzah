import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";

interface OrderItem {
  productId: string;
  quantity: number;
  title?: string;
}

/**
 * Validates if the requested quantities are available in stock.
 * Returns an object indicating success or a list of out-of-stock items.
 */
export async function checkStockAvailability(items: OrderItem[]): Promise<{
  available: boolean;
  insufficientItems: { title: string; requested: number; available: number }[];
}> {
  await connectDB();
  const insufficientItems: { title: string; requested: number; available: number }[] = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      insufficientItems.push({
        title: item.title || "Unknown Product",
        requested: item.quantity,
        available: 0,
      });
      continue;
    }

    if (product.stock < item.quantity) {
      insufficientItems.push({
        title: product.title || product.name || "Product",
        requested: item.quantity,
        available: product.stock,
      });
    }
  }

  return {
    available: insufficientItems.length === 0,
    insufficientItems,
  };
}

/**
 * Deducts quantities from the products' stock in MongoDB.
 */
export async function reduceProductStock(items: OrderItem[]): Promise<void> {
  await connectDB();
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
  }
}

/**
 * Restores quantities to the products' stock in MongoDB (e.g. upon order cancellation).
 */
export async function restoreProductStock(items: OrderItem[]): Promise<void> {
  await connectDB();
  for (const item of items) {
    await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { stock: item.quantity } },
      { new: true }
    );
  }
}
