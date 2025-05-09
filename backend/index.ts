import express from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import createDatabaseRouter from './routes/create-database';
import customersRouter from './routes/customers';
import ordersRouter from './routes/orders';
import http from 'http';
import debug from 'debug';
import { dbInitiator } from './config/db-initiator';
import { scheduleInitiator } from './config/schedule-initiator';

const app = express();

dbInitiator.createDatabase().then(() => {
    scheduleInitiator.createSchedules();
  });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/create-database', createDatabaseRouter);
app.use('/customers', customersRouter);
app.use('/orders', ordersRouter);

// catch 404 and forward to error handler
app.use((req: any, res: any, next: any) => {
    next(createError(404));
  });

// error handler
app.use((err: any, req: any, res: any, next: any) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });


/**
 * Get port from environment and store in Express.
 */

 const port = normalizePort(process.env.PORT || '3000');
 app.set('port', port);

 /**
  * Create HTTP server.
  */

 const server = http.createServer(app);

 /**
  * Listen on provided port, on all network interfaces.
  */

 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);

 /**
  * Normalize a port into a number, string, or false.
  */

 function normalizePort(val: any) {
   const thePort = parseInt(val, 10);

   if (isNaN(thePort)) {
     // named pipe
     return val;
   }

   if (thePort >= 0) {
     // port number
     return thePort;
   }

   return false;
 }

 /**
  * Event listener for HTTP server "error" event.
  */

 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }

   const bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;

   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
      debug(bind + ' requires elevated privileges');
       process.exit(1);
       break;
     case 'EADDRINUSE':
      debug(bind + ' is already in use');
       process.exit(1);
       break;
     default:
       throw error;
   }
 }

 /**
  * Event listener for HTTP server "listening" event.
  */

 function onListening() {
   const addr = server.address();
   const bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   debug('Listening on ' + bind);
 }

