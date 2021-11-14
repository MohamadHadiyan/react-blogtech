import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { IDecodedToken, IReqAuth } from "../config/interface";
import Users from "../models/userModel";

const checkToken = async (req: IReqAuth, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!!token) {
      const decoded = <IDecodedToken>(
        jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
      );

      if (decoded) {
        const user = await Users.findOne({ _id: decoded.id }).select(
          "-password"
        );
        if (user) req.user = user;
      }
    }

    next();
  } catch (err: any) {
    return res.status(500).json({ msg: err.message });
  }
};

export default checkToken;
