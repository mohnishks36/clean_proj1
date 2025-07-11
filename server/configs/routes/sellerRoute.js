import express from 'express';
import { isSellerAuth, sellerLogin, sellerLogout } from '../controllers/sellerController.js';
import authSeller from '../middlewares/authSeller.js';

const sellerRouter = express.Router();

// Login seller and create token
sellerRouter.post('/login', sellerLogin);

// Verify seller auth status using middleware and controller
sellerRouter.get('/is-auth', authSeller, isSellerAuth);

// Logout seller and clear token
sellerRouter.get('/logout', sellerLogout);

export default sellerRouter;
