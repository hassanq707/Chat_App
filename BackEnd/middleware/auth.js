import USER from "../models/userModel.js";
import { getUser } from "../service/token.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token)
    return res.json({ success: false, message: "Login First to Proceed" });

    const user = getUser(token);

    if (!user)
    return res.json({ success: false, message: "Invalid Token" })
    
    const findUser = await USER.findById(user.userId).select("-password")

    if (!findUser)
    return res.json({ success: false, message: "User not found" });

    req.user = findUser;
    next();

  } catch (err) {
    return res.json({ success: false, message: "Server Error" });
  }
};

