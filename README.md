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

### HTTP REQUEST

| Method | Endpoint          | Description                               |
| ------ | ----------------- | ----------------------------------------- |
| GET    | `/api/v1/events`     | Retrieve the complete list of events  |
| GET    | `/api/v1//event`     | Retrieve the complete list of tickets  |
| GET    | `/api/v1/events/:id` | Retrieve a specific events based on ID |
