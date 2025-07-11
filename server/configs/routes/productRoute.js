import express from "express";
import upload  from "../multer.js";
 // 🔁 Destructure upload if exported that way
import authSeller from "../middlewares/authSeller.js";

import {
  addProduct,
  productById,
  productList,
  changeStock,
} from "../controllers/productController.js";

const productRouter = express.Router();

// Add Product (with multiple images)
productRouter.post('/add', authSeller, upload.array(["images"], 5), addProduct); 
// 🛠 Max 5 files. Adjust if needed.
// 🛡 authSeller should be before upload to avoid unnecessary processing if unauthorized

// Get Product List
productRouter.get('/list', productList);

// Get Product by ID (Consider using route params instead)
productRouter.get('/id', productById);
// 👇 Suggested change:
// productRouter.get('/:id', productById);
// Then in controller: const { id } = req.params;

// Change stock (authenticated sellers only)
productRouter.post('/stock', authSeller, changeStock);

export default productRouter;
