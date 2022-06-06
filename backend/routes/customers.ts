import express, { Express, Request, Response } from 'express';
import { CustomerRepository } from '../repositories/customer-repository';
import { OrderRepository } from '../repositories/order-repository';
import { IOrder } from '../models/order';
import { debug } from 'console';

const customerRepository = new CustomerRepository();
const orderRepository = new OrderRepository();

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

    const startDate: any = getLastYearDayOneTime();

    // get the orders of the customer and return
    orderRepository.getCustomerOrders(req.params.customerId, startDate).then((result: IOrder[]) => {
      debug(result);
      res.send(result);
    }).catch((err: any) => {
      res.status(500).send({
        message: 'Query failed.',
        error: err
      });
    });
  });

// calculate the start time of last year day 1 from local time
function getLastYearDayOneTime(): number {
  const startDate: Date = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);
  startDate.setMonth(0);
  startDate.setDate(1);
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);
  debug(startDate.toLocaleString());
  return startDate.getTime();
}

export default app;
