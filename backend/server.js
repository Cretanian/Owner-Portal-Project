require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./routes");

app.use(cors({ credentials: false, origin: "http://localhost:5173" }));
app.use(express.json({ limit: "15mb" }));

const port = process.env.PORT || 5000;

routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
