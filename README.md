
This code exercise is for the code challenge from [Ichigo](https://tokyotreat.atlassian.net/wiki/external/1590558953/ODJhODU1MGQ5NmMyNGFmNWFkOGI0YWZhMGI3MzI3OTM).


## Backend
The backend API was developed with Nodejs v14.18.1

### Run the backend
Navigate to the 'backend' folder and start the server at port 3000 by shell command:
```shell
npm start
```

Then call http://localhost:3000/create-database to create the database structure.

### About database design
Foreign key constraints was not added for consideration of possible data inconsistency from outside order input.