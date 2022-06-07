import express, { Express, Request, Response } from 'express';
import { CustomerRepository } from '../repositories/customer-repository';
import { OrderRepository } from '../repositories/order-repository';
import { CustomerOrderService } from '../services/customer-order';
import { IOrder } from '../models/order';
import { debug } from 'console';
import { dbDateTimeUtil } from '../utilities/dbDateTimeUtil';

const customerRepository = new CustomerRepository();
const orderRepository = new OrderRepository();
const customerOrderService = new CustomerOrderService(orderRepository, customerRepository);

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
  customerOrderService.getCustomerWithStats(req.params.customerId).then((result: any) => {
      if (result == null) {
        res.status(404).end();
      } else {
        res.send(result);
      }
    }).catch((err: any) => {
        res.status(500).send({
          message: 'Query failed.',
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
  // calculate the start time of last year day 1 from local time
  const startDate: any = dbDateTimeUtil.getUTCStartOfLastYear();
  debug(`startDate: ${startDate}`);
  // get the orders of the customer and return
  orderRepository.getCustomerOrders(req.params.customerId, startDate).then((result: IOrder[]) => {
    res.send(result);
  }).catch((err: any) => {
    res.status(500).send({
      message: 'Query failed.',
      error: err
    });
  });
});

export default app;
