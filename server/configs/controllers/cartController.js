
import User from '../models/User.js'; // Adjust path if needed

//Update User Cart Data: /api/cart/update

export const updateCart=async(req,res)=>{
    try{
        const {userId,cartItems}=req.body;
        await User.findByIdAndUpdate(userId,{cartItems})
        return res.json({success:true,message:"Cart Updated"})
    }
    catch(err){
        console.log(err.message)
        res.json({success:false,message:err.message})
    }
}
