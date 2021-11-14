import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IDecodedToken, IReqAuth } from "../config/interface";
import User from "../models/userModel";

const auth = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    const decoded = <IDecodedToken>(
      jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    );

    if (!decoded) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    const user = await User.findOne({ _id: decoded.id }).select("-password");

    if (!user) {
      return res.status(400).json({ msg: "User does not exist." });
    }

    req.user = user;

    next();
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

export default auth;
