
This code exercise is for the code challenge from [Ichigo](https://tokyotreat.atlassian.net/wiki/external/1590558953/ODJhODU1MGQ5NmMyNGFmNWFkOGI0YWZhMGI3MzI3OTM).


## Backend
The backend API was developed with Nodejs v14.18.1

### Database setup
Before running backend server, there should be a mariaDB/mySQL instance running up, the default database settings are as below:
```JSON
      host: "localhost",
      user: "root",
      password: "",
      database: "loyalty_tier",
```
Please feel free to change the settings if necessary, the settings reside in ./config/config.ts.

*HINT: You do not need to manually create the database as long as the provided database user is with database creation permission. On startup the server will automatically create the database if it does not exist and create all related tables, indexes, and load the initial data.*

### Run the backend
Navigate to the 'backend' folder and start the server at port 3000 by shell command:
```shell
npm start
```

### The endpints
- The endpoint to report completed order:

  ```
  {POST} /orders
  ```

- The endpoint to manually recalculate loyalty tier, just in case you need to do it:
  
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

### Editable tier rules
The loyalty tier rules are stored in tier_rule table, if you want to redefine the rules, you need to restart the server after you modify the table.

### Foreign key
Foreign key constraints was not added for consideration of possible data inconsistency from outside order input.

I choose not to use any ORM framework because this is a small project, but if the application keep growing, we may want to adopt it.
