import express, { Express, Request, Response } from 'express';

const app: Express = express();

/* GET home page. */
app.get('/', (req: Request, res: Response, next: any) => {
    res.render('index', { title: 'Express' });
  });

export default app;
