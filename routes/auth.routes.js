const router = require("express").Router();
const bcryptJS = require("bcryptjs");
const { loginSchema, registerSchema } = require("../schema/auth.schema");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

router.post("/login", async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error.details[0].message,
    });
  }

  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (!userExists)
      return res.status(401).json({ error: "Authentication failed !!" });

    const passwordMatched = await bcryptJS.compare(
      password,
      userExists.password
    );
    if (!passwordMatched)
      return res
        .status(401)
        .json({ error: "Email or passowrd didn't matched !!" });

    const token = jwt.sign(
      { id: userExists.id, email: userExists.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const { password: _, ...userWithoutPassword } = userExists.toJSON();

    res.status(200).json({
      message: "Login succesful",
      accessToken: token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation Error",
      error: error.details[0].message,
    });
  }

  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res
        .status(400)
        .json({ message: `User with ${email} already exits !!` });
    const salt = bcryptJS.genSaltSync(+process.env.SALT_LEN);
    const hashedPassword = await bcryptJS.hash(password, salt);

    const registeredUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = registeredUser.toJSON();

    res.status(201).json({
      message: "User registered successfully!",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = { router };
