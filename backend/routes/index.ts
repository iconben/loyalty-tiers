import cors from 'cors';
import express, { Express, Request, Response } from 'express';

const app: Express = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

/* GET home page. */
app.get('/', (req: Request, res: Response, next: any) => {
    res.render('index', { title: 'Express' });
  });

export default app;
