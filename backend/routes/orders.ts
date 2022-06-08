import { debug } from 'console';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { Order } from '../models/order';
import { CustomerOrderService } from '../services/customer-order';

const app: Express = express();
const customerOrderService = new CustomerOrderService();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
  origin: '*'
  }));


/**
 * @api {post} /orders
 * @description Save a completed order.
 */
app.post('/', (req: Request, res: Response, next: any) => {
    const order: Order = req.body;
    // validate the order input:
    if (!order) {
        res.status(400).send({
            message: 'Order is required.'
        });
        return;
    }
    if (!order.orderId) {
      res.status(400).send({
          message: 'Order id is required.'
      });
      return;
  }
    if (!order.customerId) {
        res.status(400).send({
            message: 'Customer id is required.'
        });
        return;
    }
    if (!order.customerName) {
      res.status(400).send({
          message: 'Customer name is required.'
      });
      return;
    }
    if (!order.totalInCents) {
        res.status(400).send({
            message: 'Total in cents is required.'
        });
        return;
    } else if (order.totalInCents < 0) {
      res.status(400).send({
          message: 'Total in cents should be a non-negative number.'
      });
      return;
    } else if (order.totalInCents.toString().indexOf('.') !== -1) {
      res.status(400).send({
          message: 'Total in cents should be an integer.'
      });
      return;
    }
    // make sure the ISO date string is converted into a Date object correctly:
    try {
      order.date = new Date(order.date as unknown as string);
    }catch(e) {
      res.status(400).send({
          message: 'Invalid date format.'
      });
      return;
    }
    customerOrderService.saveOrder(order).then((result: any) => {
      res.status(201).send(result);
    }).catch((err: any) => {
        res.status(500).send({
          message: 'Order saving failed.',
          error: err.toString(),
          entity: order
        });
      }
    );
  });

export default app;
