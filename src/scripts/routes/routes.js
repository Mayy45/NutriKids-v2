import Home from "../pages/home/home-page";
import About from "../pages/about/about-page";
import Features from "../pages/features/features-page";
import Contact from "../pages/contact/contact-page";
import FoodInput from "../pages/food-input/food-input-page";
import LoginPage from "../pages/auth/login-page";
import RegisterPage from "../pages/auth/register-page";
import FoodDetail from "../pages/food-input/food-detail";
import TableUser from "../pages/user/listUser-page";

const Routes = {
  "/": Home,
  "/home": Home,
  "/food-input": FoodInput,
  "/about": About,
  "/features": Features,
  "/contact": Contact,
  "/login": LoginPage,
  "/register": RegisterPage,
  "/food-detail": FoodDetail,
  "/user": TableUser,
};

export default Routes;
