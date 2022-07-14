import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as authRepository from "../repositories/authRepository.js";
import { CreateUserData } from "../repositories/authRepository.js";

export async function signUp(user: CreateUserData) {
  const SALT = 10;
  const isEmailExist = await authRepository.findUserByEmail(user.email);

  if (!isEmailExist) {
    user.password = await bcrypt.hash(user.password, SALT);
    await authRepository.createUser(user);
    
  } else {
    throw {
      type: "Conflict",
      message: "E-mail already exist",
    };
  }

  return;
}

export async function signIn(user: CreateUserData) {
  const userInfo = await authRepository.findUserByEmail(user.email);
  const isCorrectPassword = await bcrypt.compare(user.password, userInfo.password);

  if (!userInfo) {
    throw {
      type: "Not_Found",
      message: "E-mail not register",
    };
  }

  if (!isCorrectPassword) {
    throw {
      type: "Unauthorized",
      message: "Wrong password",
    };
  }

  const key = process.env.JWT_SECRET;
  const expiresAt = { expiresIn: 60 * 60 * 24 };
  const token = jwt.sign({ id: userInfo.id, email: user.email }, key, expiresAt);

  return token;
}
