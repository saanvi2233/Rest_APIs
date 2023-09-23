import Joi from "joi";
import refreshToken from "../../models/refreshToken.js";
import User from "../../models/user.js";
import CustomErrorHandler from "../../sevices/CustomErrorHandler.js";
import JwtService from "../../sevices/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";
const refreshController = {
  async refresh(req, res, next) {
    //validation of request

    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });

    const { error } = refreshSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    //database
    let refreshtoken;
    try {
      refreshtoken = await refreshToken.findOne({
        token: req.body.refresh_token,
      });
      if (!refreshToken) {
        return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
      }
      let userId;

      try {
        const { _id } = await JwtService.verify(
          refreshtoken.token,
          REFRESH_SECRET
        );
        userId = _id;
      } catch (err) {
        return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
      }

      //user check karna ka liya
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return next(CustomErrorHandler.unAuthorized("no user found"));
      }

      //generate tokens
      const access_token = JwtService.sign({ _id: user._id, role: user.role });

      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECRET
      );
      //database whitelist

      await refreshToken.create({ token: refresh_token });
      res.json({ access_token, refresh_token });

      console.log(refreshToken);
    } catch (err) {
      return next(new Error("Something went wrong!" + err.message));
    }
  },
};
export default refreshController;
