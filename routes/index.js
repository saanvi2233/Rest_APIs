import express from "express";
import auth from "../middlewares/auth.js";
const router = express.Router();
import {
  registerController,
  loginController,
  userController,
  refreshController,
  productController
} from "../controllers/index.js";
//import productController from "../controllers/products.js";
import admin from '../middlewares/admin.js';
router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshController.refresh);
router.post("/logout", auth, loginController.logout);
//middleware auth isliya lagaya bcoz only registered user is logout karskta hai

router.post("/products", [auth,admin],productController.store);
router.put("/products/:id", [auth,admin],productController.update);
//:id-dynamic parameter

//delete
router.delete("/products/:id", [auth,admin],productController.destroy);
router.get("/products",productController.index);
router.get("/products/:id",productController.show);

router.post('/products/cart-items',productController.cartProducts);
export default router;
