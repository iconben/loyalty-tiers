
## Backend
The backend API was developed with Nodejs v14.18.1

### Database setup
Before running backend server, there should be a mariaDB/mySQL instance running up, the default database settings are as below:
```JSON
      host: "localhost",
      user: "root",
      password: "",
      database: "loyalty_tier",
      connectionLimit: 20,
```
Please feel free to change the settings if necessary, the settings reside in ./config/config.ts.

The connectionLimit is for the connection pool size, please adjust on your needs.

*HINT: You do NOT need to manually create the database as long as the provided database user is with database creation permission. On startup the server will AUTOMATICALLY create the database if it does not exist and create all related tables, indexes, and load the initial data.*

### Run the backend
Navigate to the 'backend' folder and start the server at port 3000 by shell command:
```shell
npm start
```

### About tier recalculation
There are two automatic recalculation:
1. Schedule to run recalculation on the fist day of each UTC year;
2. Recalculate when a new order for a new customer or when an order is since last year

### The endpoints for external app and admins:
- To report completed order:

  ```
  {POST} /orders
  ```

- To manually recalculate loyalty tier:
  
  for all customers:

  ```
  {GET} /customers/recalculate
  ```
  for one customer:

  ```
  {GET} /customers/:customerId/recalculate
  ```

### Develop backend
If you want to develop the backend with hot reload, run:
```shell
npm run dev
```

## About database design
The creation SQL scripts are in ./config/db-initiator.ts.  

### naming convention
Table and field : lower case characters connected by underscore.

### About Indexes and Foreign keys
Created foreign key and index for customerId in order table.

### Editable tier rules
The loyalty tier rules are stored in tier_rule table, if you want to redefine the rules, you need to restart the server after you modify the table.

