const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const DB_NAME = process.env.DB_NAME || "db_mongo";
mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`).catch((err) => {
  console.log(err);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

const phoneSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
  specs: { type: Object, required: true },
});

const Phone = mongoose.model("phones", phoneSchema);

const app = express();
app.use(express.json());

app.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const phonen = await Phone.create(body);
    res.status(200).send({ data: phonen });
  } catch (error) {
    next(error);
  }
});

app.get("/", async (req, res, next) => {
  try {
    const phones = await Phone.find();
    res.status(200).send({ data: phones });
  } catch (error) {
    next(error);
  }
});

app.patch("/:id", async (req, res, next) => {
  try {
    const {
      body,
      params: { id },
    } = req;
    const updatePhone = await Phone.findOneAndUpdate({ _id: id }, body, {
      returnDocument: "after",
    });
    res.send(updatePhone);
  } catch (error) {
    next(error);
  }
});

app.delete("/:id", async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const deletedPhone = await Phone.findOneAndDelete({ _id: id });
    res.send(deletedPhone);
  } catch (error) {
    next(error);
  }
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("server is up");
});
