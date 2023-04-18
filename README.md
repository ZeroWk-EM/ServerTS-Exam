# [EVENT] - EXAM

1. Install dependance with `npm i`
2. Create .env (or use existing) file and fill the value

```
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/ticketZero
```

### SCRIPT

The `package.json` contain 3 script

- start => start the server and use database `exam_prod`

- dev => start the server and use database `exam_dev`

- test start the server and use database `exam_test`

- build => transcompilation TS in JS

## HTTP REQUEST

### EVENT
| Method | Endpoint          | Description                               |
| ------ | ----------------- | ----------------------------------------- |
| GET    | `/api/v1/events`     | Retrieve the complete list of events  |
| GET    | `/api/v1/events/:id` | Retrieve a specific events based on ID |
|GET |`/api/v1/events/:id/tickets` | Retrieve a specific info about a ticket |
|POST |`/api/v1/events/:id/tickets` | Create a new ticket and decreases available places |
|POST | `/api/v1/events` | Create an  new event|
| PUT    | `/api/v1/events/:id` | Update a specific events based on ID |
| DELETE    | `/api/v1/events/:id` | Delete a specific events based on ID |


### TICKET
| Method | Endpoint          | Description                               |
| ------ | ----------------- | ----------------------------------------- |
| GET    | `/api/v1//event`     | Retrieve the complete list of tickets  |




