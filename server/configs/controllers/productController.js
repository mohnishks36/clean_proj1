import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

// Add product: /api/product/add
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files;

    // Upload all images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, {
          resource_type: 'image',
        });
        return result.secure_url;
      })
    );

    // Create new product
    await Product.create({
      ...productData,
      image: imagesUrl,
    });

    res.json({ success: true, message: 'Product Added' });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

// Get product list: /api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

// Get single product by ID: /api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

// Change product stock: /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: 'Stock Changed' });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
