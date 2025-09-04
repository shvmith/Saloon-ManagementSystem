import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcryptjs.hashSync(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role,
  });
  try {
    await newUser.save();
    res.status(201).json("User created successfully!!!");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email: email.toLowerCase() });

    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Email or Password incorrect" });
    }

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.JWT_SECRET
      // { expiresIn: "1h" }
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ token, user: rest });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been signed out!");
  } catch (error) {
    next(error);
  }
};
