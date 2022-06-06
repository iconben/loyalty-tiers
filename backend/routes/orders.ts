import express, { Express, Request, Response } from 'express';
// const Order = require('../models/order');

const app: Express = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

/**
 * @api {post} /orders
 * @description POST a completed order.
 */
app.post('/', (req: Request, res: Response, next: any) => {
    const order = req.body;
    res.send(order);
  });

export default app;
