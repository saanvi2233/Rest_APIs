import Product from "../../models/product.js";
import multer from "multer";
import path from "path";
import CustomErrorHandler from "../../sevices/CustomErrorHandler.js";
import fs from "fs";
import Joi from "joi";
import productSchema from "../../validators/productValidator.js";
// initial configuration before using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${path.basename(
      file.originalname
    )}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limit: { fileSize: 1000000 * 5 },
}); //.single('fileImg')
let uploadMultiple = handleMultipartData.fields([
  { name: "image", maxCount: 10 },
  { name: "fileImg", maxCount: 10 },
]);

const productController = {
  async store(req, res, next) {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }
      //console.log(req)
      console.log(req.files);
      const file2Path = req.files.image[0].path;
      

      const { error } = productSchema.validate(req.body);
      if (err) {
        //delete the uploaded file
        fs.unlink(`${appRoot}${file2Path}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
        return next(error);
        //rootfolder/upload/filename.png
      }
      const { name, price, size } = req.body;
      let document;
console.log(file2Path);
      try {
        document = await Product.create({
          name,
          price,
          size,
          image: file2Path,
        });
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  
    //update method
  },
  update(req, res, next) {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError(err.message));
      }

      console.log(req.files);
     const file2Path = req.files.image[0].path;
      
      const { error } = productSchema.validate(req.body);
      if (err) {
        //delete the uploaded file
        if (req.files) {
          fs.unlink(`${appRoot}${file2Path}`, (err) => {
            if (err) {
              return next(CustomErrorHandler.serverError(err.message));
            }
          });
        }
        return next(error);
        //rootfolder/upload/filename.png
      }
      const { name, price, size } = req.body;
      let document;

      try {
        document = await Product.findOneAndUpdate(
          { _id: req.params.id },
          {
            name,
            price,
            size,
            ...(req.file && { image: file2Path }), //file here is optional
          },
          { new: true }
        );
        console.log(document);
      } catch (err) {
        return next(err);
      }
      res.status(201).json(document);
    });
  },

  //delete products
  async destroy(req, res, next) {
    const document = await Product.findOneAndRemove({ _id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }

    //image delete
    const imagePath = document._doc.image;
    fs.unlink(`${appRoot}/${imagePath}`, (err) => {
      if (err) {
        return next(CustomErrorHandler.serverError());
      }
     return res.json(document);
    });
  
  },

  async index(req, res, next) {
    let documents;
    //pagination mongoose-pagination for many products
    try {
      documents = await Product.find()
        .select("-updatedAt -__v")
        .sort({ _id: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },


//show method

async show(req,res,next){
  let document;
  try{
document=await Product.findOne({ _id:req.params.id}).select('-updatedAt -__v');
  }catch(err){
    return  next(CustomErrorHandler.serverError());
  }
  return res.json(document);
},
//getproducts method
async cartProducts(req,res,next){
  let documents;
  try{
    documents=await Product.find({
      _id:{$in:req.body.ids},
    }).select('-updatedAt -__v');
  }catch(err){
return next(CustomErrorHandler.serverError());
  }
  return res.json(documents);
},


};

export default productController;
