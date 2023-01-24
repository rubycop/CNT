const cors = require("cors");
const express = require("express");
const url = require("url");

const app = express();
const port = process.env.SERVER_PORT;
const corsConfig = {
  origin: [
    "http://localhost:1234",
    "https://test.contesty.app",
    "https://contesty.app",
  ],
  methods: "GET,OPTION,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsConfig));

app.get("/api/set_winner", async (request, response) => {
  setTimeout(() => {}, 60000);
  // console.log(wallet);
  return response.json({ data: true });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
