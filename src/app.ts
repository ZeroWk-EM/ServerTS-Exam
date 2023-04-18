import express from "express";
import dotenv from "dotenv";
import { connectToMongoDB } from "./configs/db.connection.config";

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.status(200).json({ status_code: 200, message: "Server is started" });
});

// IMPORT RESOURCES
import ticketRoute from "./routes/ticket.routes"
import eventRoute from "./routes/event.routes";

// DEFINE ENDPOINT
app.use("/api/v1/events", eventRoute);
app.use("/api/v1/tickets", ticketRoute);

app.listen(port || 3000, () => {
  console.log(`\x1b[32m[Server] Server Connected on port ${port}\x1b[0m`);
  connectToMongoDB();
});

export default app;
