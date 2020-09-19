import express from 'express';
import { userRoutes } from './user.route';
import { countriesRoutes } from './country.route';
import { locationsRoutes } from './locations.route';

export const routes = express();

routes.use("/login",userRoutes)
routes.use("/country",countriesRoutes)
routes.use("/location",locationsRoutes)
