import express, { Express, Request, Response } from 'express';
import { DbInitiator } from '../config/db-initiator';

const app: Express = express();
const dbInitiator = new DbInitiator();

/**
 * @api {post} /create-database
 * @description Create the database
 */
app.get('/', (req: Request, res: Response, next: any) => {
    dbInitiator.createDatabase().then((result: any) => {
        res.send({
          message: 'Query executed successfully.',
          details: result
        });
        res.end();
      }).catch((err: any) => {
          res.status(500).send({
            message: 'Query failed.',
            error: err
          });
        });
  });

export default app;
