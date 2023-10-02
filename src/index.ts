import express from "express";
import { Producer, Consumer } from "./controllers/pushController";

const app = express();
const port = 3001;

app.use(express.json());

app.post("/producer", Producer);
app.post("/consumer", Consumer);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
