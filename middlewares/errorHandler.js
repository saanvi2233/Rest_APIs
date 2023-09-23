import pkg from "joi";
import { DEBUG_MODE } from "../config/index.js";
import CustomErrorHandler from "../sevices/CustomErrorHandler.js";
const { ValidationError } = pkg

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  console.log(err)
  let data = {
    message: "Internal server error",
    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };
  if (err instanceof ValidationError) {
    statusCode = 422;
    data = {
      message: err.message,
    };
  }

  if (err instanceof CustomErrorHandler) {
    console.log(err)
    statusCode = err.status;
    data = {
      message: err.msg,
    };
  }

return res.status(statusCode).json({data});
};

export default errorHandler;
