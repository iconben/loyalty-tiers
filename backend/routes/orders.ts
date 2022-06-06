import express, { Express, Request, Response } from 'express';
import { IOrder } from '../models/order';
import { CustomerRepository } from '../repositories/customer-repository';
import { OrderRepository } from '../repositories/order-repository';
import { CustomerOrderService } from '../services/customer-order';

const app: Express = express();
const customerOrderService = new CustomerOrderService(new OrderRepository(), new CustomerRepository());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

/**
 * @api {post} /orders
 * @description Save a completed order.
 */
app.post('/', (req: Request, res: Response, next: any) => {
    const order: IOrder = req.body;
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
    }
    customerOrderService.saveOrder(order).then((result: any) => {
        res.status(201);
        res.end();
      }).catch((err: any) => {
          res.status(500).send({
            message: 'Order Saving failed.',
            error: err,
            entity: order
          });
        }
      );
  });

export default app;
