import Joi from "joi";
import CustomErrorHandler from "../../sevices/CustomErrorHandler.js";
//import bcrypt from "bcrypt";
import { User, RefreshToken } from "../../models/index.js";
import JwtService from "../../sevices/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";
const loginController = {
  async login(req, res, next) {
    //validation
    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { email, password } = req.body;
    //check if user in database is already
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return next(CustomErrorHandler.wrongCredential());
      }
      // comapre the password
      console.log(password,user.password)
      //const match = await bcrypt.compare(password, user.password);
      if (password !== user.password) {
        return next(CustomErrorHandler.wrongCredential());
      }

      //genrate token
      const access_token = JwtService.sign({ _id: user._id, role: user.role });

      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      //database whitelist

      await RefreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });
    } catch (err) {
      return next(err);
    }
  },

//logout method
async logout(req,res,next){
    //validation
    const refreshSchema = Joi.object({
        refresh_token: Joi.string().required(),
      });
  
      const { error } = refreshSchema.validate(req.body);
      if (error) {
        return next(error);
      }


    try{
await RefreshToken.deleteOne({token:req.body.refresh_token});
    }catch(err){
        return next(new Error('Something went wrong in the database'))
    }
res.json({status:1});
}


};

export default loginController;
