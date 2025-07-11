import jwt from "jsonwebtoken";
import 'dotenv/config';


//Login Seller

export const sellerLogin = async (req, res) => {
  try{

    const { email, password } = req.body;

  if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
    const token = jwt.sign({ role: 'seller', email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('sellerToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true, message: "Logged In" });
  }
  else{
    return res.json({ success: false, message: "Invalid Credentials" });
  
  }
  }
  catch(err){
    res.json({success:false,message:err.message});
  
}
}


export const isSellerAuth=async(req,res)=>{
  try{
    return res.json({success:true});

  }
  catch(err){
    res.json({success:false,message:err.message});
  }
}


export const sellerLogout=async(req,res)=>{
  try{

    res.clearCookie('sellerToken',{
      httpOnly:true,
      secure:process.env.NODE_ENV==='production'?'none':'strict',
    })
    return res.json({success:true,message:"Logged Out"});
  }
  catch(err){
    res.json({success:false,message:err.message});
  }

}