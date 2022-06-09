import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { DbInitiator } from '../config/db-initiator';

const app: Express = express();
const dbInitiator = new DbInitiator();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

/**
 * @api {get} /create-database
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
            error: err.toString()
          });
        });
  });

export default app;
