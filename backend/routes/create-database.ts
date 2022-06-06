import express, { Express, Request, Response } from 'express';
import Db from '../repositories/db';

const app: Express = express();
const db = new Db();

/**
 * @api {post} /create-database
 * @description Create the database
 */
app.get('/', (req: Request, res: Response, next: any) => {
    db.createDatabase().then((result: any) => {
        res.send({
          Message: 'Query executed successfully.',
          details: result
        });
        res.end();
      }).catch((err: any) => {
          res.status(500).send({
            Message: 'Query failed.',
            error: err
          });
        });
  });

export default app;
