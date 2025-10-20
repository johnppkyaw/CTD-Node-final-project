const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');
app.use(express.json());

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
}));
app.use(helmet());
app.use(cors());
app.use(xss());

//connectDB
const connectDB = require('./db/connect');

//middleware
const authenticateUser = require('./middleware/authentication');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//routers
const authRouter = require('./routes/auth');
const residentsRouter = require('./routes/residents');

app.use(express.static("public"));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/residents', authenticateUser, residentsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

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
