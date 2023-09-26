import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
