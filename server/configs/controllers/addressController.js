import Address from "../models/Address.js";
//Add Address: /api/address/add
export const addAddress = async (req, res) => {
  try {
    const { address } = req.body; // only extract `address` from body
    const userId = req.user._id;  // get user ID from token

    await Address.create({ ...address, userId });

    res.json({ success: true, message: "Address Added" });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};

    //Get Address: /api/address/get

  // Get Address: /api/address/get
export const getAddress = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ get userId from the token, not from req.body
    const addresses = await Address.find({ userId });

    res.json({ success: true, addresses });
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
};
