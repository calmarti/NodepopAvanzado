//const { User } = require("../models");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


//¿si tiene un sólo método no podríamos reeemplazar la clase por una función?

class LoginController {
  async auth(req, res, next) {
    try {
      const { email, password } = req.body;
      //console.log(req.body)
      const user = await User.findOne({ email });
      //console.log(user)
      if (!user || !(await user.comparePasswords(password))) {
        res.status(401).json({ Error: "Wrong email or password" });
        return;
      }

      jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
        (err, token) => {
          if (err) {
            next(err);
            return;
          }
          res.json({ token: token });
        }
      );
    } catch (err) {
      next(err); 
    }
  }
}

module.exports = LoginController;

