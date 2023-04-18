# [EVENT] - EXAM

1. Install dependance with `npm i`
2. Create .env (or use existing) file and fill the value OR use this template

```
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/ticketZero
SECRET_JWT=M6EGW8sAGq4gquTd62Mo
SALT_ROUND=10
```

### SCRIPT

The `package.json` contain 3 script

- start => start the server and use database `exam_prod`

- dev => start the server and use database `exam_dev`

- test start the server and use database `exam_test`

- build => transcompilation TS in JS