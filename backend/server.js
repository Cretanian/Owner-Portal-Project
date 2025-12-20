const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json({ limit: "15mb" }));

const Axios = axios.create({
  baseURL: "https://api.hostaway.com/v1",
  headers: {
    Authorization: `Bearer ${process.env.API_ACCESS_TOKEN}`,
  },
});

app.get("/listings", async (req, res) => {
  const response = await Axios.get("/listings");

  return res.status(200).send(response.data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
