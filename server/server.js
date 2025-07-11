import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/db.js";
import 'dotenv/config';
import userRouter from "./configs/routes/userRoute.js";
import sellerRouter from "./configs/routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./configs/routes/productRoute.js";
import addressRouter from "./configs/routes/addressRoute.js";
import orderRouter from "./configs/routes/orderRoute.js";
import cartRouter from "./configs/routes/cartRoute.js";
import { stripeWebhooks } from "./configs/controllers/orderController.js";

const app=express();

const port=process.env.PORT||4000;

await connectDB();
await connectCloudinary();


//Allow multiple origins
const allowedOrigins=['http://localhost:5173']

app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}))


app.get('/',(req,res)=>{
    res.send("api is working");
})
app.use('/api/user',userRouter);
app.use('/api/seller',sellerRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/address',addressRouter);
app.use('/api/order',orderRouter);


app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})