import CustomErrorHandler from "../sevices/CustomErrorHandler.js";
import JwtService from "../sevices/JwtService.js";

const auth= async (req,res,next)=>{
let authHeader=req.headers.authorization;

//console.log(authHeader);

if(!authHeader){
    return next(CustomErrorHandler.unAuthorized());
}

const token= authHeader.split(' ')[1];
//split any string

try{

    console.log(token);

    const{ _id,role} = await JwtService.verify(token);
    console.log(_id,role);
    const user={
        _id,
        role
    }
    req.user=user ;
    next();
    // req.user._id=_id;
    // req.user.role=role;
    }

catch(err){
    return next(CustomErrorHandler.unAuthorized());

}
//console.log(token);
}

export default auth;