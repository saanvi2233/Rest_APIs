import { User } from "../../models/index.js";
import CustomErrorHandler from "../../sevices/CustomErrorHandler.js";
const userController = {
  async me(req, res, next) {
    try {
      console.log("req.user._id:", req.user._id); 
      const user = await User.findOne({ _id:req.user._id}).select('-password -updatedAt -__v');
      //console.log("User found:", user); // Add this line for debugging

      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
      res.json(user);
    } catch (err) {
      return next(err);
    }
  },
};

export default userController;
