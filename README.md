# [TICKETZERO] - DOCUMENTATION

1. Install dependance with `npm i`
2. Create .env (or use existing) file and fill the value

```
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/ticketZero
```

## SCRIPT

The `package.json` contain 4 script

- start `=>` start the server and use database `exam_prod`

- dev `=>` start the server and use database `exam_dev`

- test `=>` start the server and use database `exam_test`

- build `=>` transcompilation TS in JS

## HTTP REQUEST

### EVENT

| Method | Endpoint                     | Description                                        |
| ------ | ---------------------------- | -------------------------------------------------- |
| GET    | `/api/v1/events`             | Retrieve the complete list of events               |
| GET    | `/api/v1/events/:id`         | Retrieve a specific events based on ID             |
| GET    | `/api/v1/events/:id/tickets` | Retrieve a specific info about a ticket            |
| POST   | `/api/v1/events/:id/tickets` | Create a new ticket and decreases available places |
| POST   | `/api/v1/events`             | Create an new event                                |
| PUT    | `/api/v1/events/:id`         | Update a specific events based on ID               |
| DELETE | `/api/v1/events/:id`         | Delete a specific events based on ID               |

### TICKET

| Method | Endpoint         | Description                           |
| ------ | ---------------- | ------------------------------------- |
| GET    | `/api/v1//event` | Retrieve the complete list of tickets |

## STRUCTURE

### EVENT

| Name Field            | Type     | Description                         | Required |
| --------------------- | -------- | ----------------------------------- | -------- |
| name                  | `String` | The event name                      | ✅       |
| typology <sup>1</sup> | `String` | the kind of event                   | ✅       |
| availablePlaces       | `String` | Available places for specific event | ✅       |
| location <sup>2</sup> | `Object` | The event location                  | ✅       |
| ticketsPrice          | `String` | Price for single ticket             | ✅       |

[1] **Typology** is an enumaration and accept only value => "Sport" or "Convention" or "Fair" or "Concert";

[2] **Location** is a nested object inside a Event and contain this field

| Name Field | Type     | Description                         | Required |
| ---------- | -------- | ----------------------------------- | -------- |
| city       | `String` | City where the event takes place    | ✅       |
| address    | `String` | Address where the event takes place | ✅       |
| postalCode | `String` | The city postcode                   | ✅       |

### TICKET

| Name Field       | Type     | Description                     | Required |
| ---------------- | -------- | ------------------------------- | -------- |
| eventName        | `String` | The event name                  | ✅       |
| owner            | `String` | Who bought the ticket           | ✅       |
| barcode          | `String` | the ticket code for scanning    | ✅       |
| buyDate          | `Date`   | when the ticket was bought      | ✅       |
| obliterationDate | `Date`   | when the ticket was obliterated | ❌       |

**N.B EACH PERSON MAY ONLY PURCHASE ONE TICKET PER EVENT** 
