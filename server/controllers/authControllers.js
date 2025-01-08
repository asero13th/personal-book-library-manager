import User from "../models/userModel.js";
import {
  hashPassword,
  generateSalt,
  validatePassword,
} from "../utils/passwordUility.js";

import {
  validateEmail,
  validateUsername,
  validatePasswordStrength,
} from "../utils/validationUtility.js";

import crypto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { tokenBlackList } from "../middleware/tokenBlackList.js";
dotenv.config();

export const userRegister = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).send({ message: "Invalid email" });
    }

    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists", status: false });
    }

    if (!validatePasswordStrength(password)) {
      return res.status(400).send({ message: "Password too weak" });
    }

    const salt = await generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      fullname,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await newUser.save();
    res.status(201).send({
      message: "User created successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .send({ message: "An error occurred while creating the user", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).send({ message: "Invalid credentials", data: user });
  }

  const isValid = await validatePassword(password, user.password);

  if (!isValid) {
    return res.status(400).send({ message: "Invalid credentials" });
  }

  const { password: _, ...userWithoutPassword } = user.dataValues;

  const token = jwt.sign(
    { id: user.id, username: user.firstName }, // Include any user information you need
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" } // Token expiration time
  );

  return res.status(200).json({ token, data: userWithoutPassword });
};

export const logoutUser = (req, res) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "No token provided." });
  }

  if (tokenBlackList.isTokenBlackListed(token)) {
    return res.status(400).json({ error: "Invalid token." });
  }

  tokenBlackList.addTokenToBlacklist(token);

  return res.status(200).json({ message: "Logout successful" });
};
