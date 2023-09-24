import Joi from "joi";
import { User,RefreshToken } from "../../models/index.js";
import CustomErrorHandler from "../../sevices/CustomErrorHandler.js";
//import bcrypt from "bcrypt";
import {REFRESH_SECRET} from '../../config/index.js';
import JwtService from "../../sevices/JwtService.js";
const registerController = {
  async register(req, res, next) {
    //validation
    const registersSchema = Joi.object({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      repeat_password: Joi.ref("password"),
    });

    console.log(req.body);
    const { error } = registersSchema.validate(req.body);
    //console.log();
    if (error) {
      //     res.json({
      //         // return next(error);

      //     })
      return res.status(400).json({ error: error.details[0].message });
    }

    //check if user is in the database already

    try {
      const exist = await User.exists({ email: req.body.email });

      if (exist) {
        const err = CustomErrorHandler.alreadyExits(
          "This email is already taken"
        );
       
        return next(err);
        //return res.json({error:"use is already taken"})
      }
    } catch (err) {
      return next(err);
    }

    const { name, email, password } = req.body;
    //Hash password
    //const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = password;
    //preapare the model

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
   

    let access_token;
    let refresh_token;

    try {
      const result = await user.save();
      console.log("result", result);
      //TOKEN
      access_token = JwtService.sign({ _id: result._id, role: result.role });
      refresh_token  = JwtService.sign({ _id: result._id, role: result.role },'1y',REFRESH_SECRET);
   //database whitelist
   await RefreshToken.create({token:refresh_token});

    } catch (err) {
      return next(err);
    }

    res.json({ access_token,refresh_token });
  },
};

export default registerController;
