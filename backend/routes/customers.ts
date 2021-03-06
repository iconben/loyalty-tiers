import express, { Express, Request, Response } from 'express';
import { OrderRepository } from '../repositories/order-repository';
import { CustomerOrderService } from '../services/customer-order';
import { Order } from '../models/order';
import { debug } from 'console';
import { dbDateTimeUtil } from '../utilities/dbDateTimeUtil';
import { CustomerVM } from '../services/customer-vm';
import cors from 'cors';
import { PageableImp } from '../services/pageableImp';
import { Page } from '../repositories/page';

const orderRepository = new OrderRepository();
const customerOrderService = new CustomerOrderService();

const app: Express = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Size'],
}));


/**
 * @api {get} /customers/recalculate
 * @description Recalculate loyalty tier for all customers
 * @returns a message indicating the number of customers processed
 */
app.get('/recalculate', (req: Request, res: Response, next) => {
  let call: Promise<any>;
  if (req.query.batchSize) {
    call = customerOrderService.updateAllCustomerLoyaltyTiers(parseInt(req.query.batchSize as string, 10))
  } else {
    call = customerOrderService.updateAllCustomerLoyaltyTiers();
  }
  call.then((result) => {
    result.message = 'Execution successfully completed.';
    res.send(result);
  }).catch((err) => {
    res.status(500).send({
      message: 'Execution failed',
      error: err.toString()
    });
  });
});

/**
 * @api {get} /customers/:customerId/recalculate
 * @description Recalculate loyalty tier for a customer
 * @param {*} customerId the customer id
 * @returns {CustomerVM} the customer view model
 */
app.get('/:customerId/recalculate', (req: Request, res: Response, next) => {
  customerOrderService.updateCustomerLoyaltyTier(req.params.customerId).then((customer) => {
    res.send(customer);
  }).catch((err) => {
    res.status(500).send({
      message: 'Execution failed',
      error: err.toString()
    });
  });
});

/**
 * @api {get} /customers/:customerId
 * @description Get a customer with spent stats
 * @param {*} customerId the customer id
 * @returns a customer view model
 */
app.get('/:customerId', (req: Request, res: Response, next) => {
  customerOrderService.getCustomerWithStats(req.params.customerId).then((result: CustomerVM) => {
      if (result == null) {
        res.status(404).end();
      } else {
        res.send(result);
      }
    }).catch((err: any) => {
        res.status(500).send({
          message: 'Query failed.',
          error: err.toString()
        });
      });
});

/**
 * @api {get} /customers/:customerId/orders
 * @description Get a customer's orders since the start of last year
 * @param {*} customerId the customer id
 * @returns a list of orders ordered by date desc
 */
app.get('/:customerId/orders', (req: Request, res: Response, next) => {
  const pageable = new PageableImp(req);
  // calculate the start time of last year day 1 from local time
  const startDate: any = dbDateTimeUtil.getUTCStartOfLastYear();
  // get the orders of the customer and return
  orderRepository.getAllByCustomerId(req.params.customerId, startDate, pageable).then((result: Order[] | Page<Order>) => {
    if (result instanceof Page) {
      res.setHeader('X-Total-Count', result.getTotalCount().toString());
      res.setHeader('X-Page', result.getPage().toString());
      res.setHeader('X-Size', result.getSize().toString());
      res.send(result.getContent());
    } else {
      res.send(result);
  }
  }).catch((err: any) => {
    res.status(500).send({
      message: 'Query failed.',
      error: err.toString()
    });
  });
});

export default app;
