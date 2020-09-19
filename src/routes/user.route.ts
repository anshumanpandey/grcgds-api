import express from 'express';
import asyncHandler from "express-async-handler"
import { checkSchema } from "express-validator"
import { sign } from 'jsonwebtoken'
import { validateParams } from '../middlewares/routeValidation.middleware';
import { ApiError } from '../utils/ApiError';
import { XmlMiddleware, BuildXmlResponse } from '../utils/XmlConfig';

export const userRoutes = express();

userRoutes.post('/login', XmlMiddleware() ,asyncHandler(async (req, res) => {
  const { CONTEXT } = req.body;
  const { Username, Password } = CONTEXT;
  
  if (Username != "hannk" || Password != "hannk") throw new ApiError("Invalid credentials");

  const jsonData = { Username: "hannk" }

  var token = sign(jsonData, process.env.JWT_SECRET || 'aa', { expiresIn: '9999 years'});
  BuildXmlResponse(res, { ...jsonData, token }, 200, "OTA_Auth")
}));
