
import jwt from 'jsonwebtoken'; 


const authUser = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;           // Keep for existing routes
    req.user = { _id: decoded.id };    // Add for new structure
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid Token' });
  }
};

export default authUser;
