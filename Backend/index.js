// Express
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// Create Instance of express
const app = express();
// For dotenv config
dotenv.config();
app.use(express.json());
// for cors error
app.use(cors());
// Port
const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URI;

// TODO SCHEMA
const todoSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
});

// create a MODEL
const todoModel = mongoose.model("Todo", todoSchema);
// const todoModel = mongoose.model("Todo <---- always give model name to singular");

// conncting mongo db
mongoose.connect(MONGOURL)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

// Create a New Todo item
// New data create we always use post
app.post("/todos", async (req, res) => {
  // All input data's get via body
  const { title, description } = req.body;
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    // it converts a json data
    res.json(todos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update A Todo Item
// Put is a Update Route
app.put("/todos/:id", async (req, res) => {
  const { title, description } = req.body;
  //   for get a id
  const id = req.params.id;
  const updatedTodo = await todoModel.findByIdAndUpdate(
    id,
    { title, description },
    // new: true for show a updated data
    { new: true }
  );

  //   Handle Null Value
  if (!updatedTodo) {
    return res.status(404).json({ message: "ToDo Not Found" });
  }
  res.json(updatedTodo);
});

// Delete
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Your Port is successfully running on port number ${PORT}`);
});
