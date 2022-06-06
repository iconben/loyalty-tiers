import express, { Express, Request, Response } from 'express';
import { CustomerRepository } from '../repositories/customer';
import { OrderRepository } from '../repositories/order';
import Db from '../repositories/db';

const customerRepository = new CustomerRepository(new Db());
const orderRepository = new OrderRepository(new Db());

const app: Express = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

/**
 * @api {get} /customers/:id
 * @description Get a customer with spent stats
 * @param {*} customerId the customer id
 * @returns a customer with spent stats
 */
app.get('/:customerId', (req: Request, res: Response, next) => {
    customerRepository.getCustomerWithStats(req.params.customerId).then((result: any) => {
        res.send(result);
      }).catch((err: any) => {
          res.status(500).send({
            Message: 'Query failed.',
            error: err
          });
        });
  });

/**
 * @api {get} /customers/:id/orders
 * @description Get a customer's orders since the start of last year
 * @param {*} customerId the customer id
 * @returns a list of orders ordered by date desc
 */
app.get('/:customerId/orders', (req: Request, res: Response, next) => {
    // calculate the start time of last year day 1
    let startDate: any = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    startDate.setMonth(0);
    startDate.setDate(1);
    startDate = startDate.getTime();

    // get the orders of the customer and return
    orderRepository.getCustomerOrders(req.params.customerId, startDate).then((result: any) => {
        res.send(result);
      }).catch((err: any) => {
        res.status(500).send({
          Message: 'Query failed.',
          error: err
        });
      });
  });

export default app;
