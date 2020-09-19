import express from 'express';
import { userRoutes } from './user.route';
import { countriesRoutes } from './country.route';

export const routes = express();

routes.use("/login",userRoutes)
routes.use("/country",countriesRoutes)
