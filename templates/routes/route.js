const router = require("express").Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

router.get("/", (req, res) => {
  res.render("welcome");
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/home", auth, (req, res) => {
  res.render("home");
});

router.post(
  "/register",
  [
    body("name", "Name must be 3+ characters long...").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Password must be 5+ characters long...").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({err: errors.array()})
      // const alert = errors.array()
      // res.render('register', {alert})
    }
    try {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ err: "Shhhhholllyyy! A User exist already" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);
        const data = new User({
          name,
          email,
          password: hashPass,
        });

        await data.save();
        req.flash('success', 'Submitted')
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send("Error Op");
    }
  }
);
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can't be empty...").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const userEmail = await User.findOne({ email });

    const token = await userEmail.JSONAuth();
    res.cookie("jwt", token);

    if (!userEmail) {
      return res
        .status(400)
        .json({ err: "Please try to login with correct credentials...." });
    }
    const pass = await bcrypt.compare(password, userEmail.password);
    if (!pass) {
      return res
        .status(400)
        .json({ err: "Please try to login with correct credentials...." });
    }


    req.flash('success_login', 'Login Successfull')
    res.redirect('/home');
  }
);
router.get('/logout', auth, (req, res)=>{
  res.clearCookie('jwt')
  res.render('login')
})

module.exports = router;
