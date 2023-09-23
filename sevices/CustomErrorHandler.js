class CustomErrorHandler extends Error {
  constructor(status,msg){
    //to call the cnstructor of the extended class that is error
    super();
    this.status = status;
    this.msg = msg;
}

    static alreadyExits(message){
      console.log(message)
      return new CustomErrorHandler(409,message);
    }
    static wrongCredential(message='Username or password is wrong!'){
      return new CustomErrorHandler(401,message);
    }
     static unAuthorized(message='unAuthorized'){
      return new CustomErrorHandler(401,message);
    }
     static notFound(message='404 Not found'){
       return new CustomErrorHandler(404,message);
    }
    static serverError(message='Internal server error'){
      return new CustomErrorHandler(500,message);
   }
}


export default CustomErrorHandler;
