const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');
app.use(express.json());

//connectDB
const connectDB = require('./db/connect');

//middleware
const authenticateUser = require('./middleware/authentication');

//routers
const authRouter = require('./routes/auth');

app.use(express.static("public"));
app.use('/api/v1/auth', authRouter);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
