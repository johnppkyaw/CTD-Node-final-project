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

//Testing for Rendered HTML
//n Express, when a page is rendered, it should set the Content-Type response header to be text/html.  But it doesn't.  The second problem is that if Chai receives a response without the Content-Type header, it tries to parse it as JSON, and throws an error if that fails.
// app.use((req, res, next) => {
//   if (req.path == "/multiply") {
//     res.set("Content-Type", "application/json");
//   } else {
//     res.set("Content-Type", "text/html");
//   }
//   next();
// });

app.use(express.static("public"));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/residents', authenticateUser, residentsRouter);

// app.get("/multiply", (req, res) => {
//   const result = req.query.first * req.query.second;
//   if (result.isNaN) {
//     result = "NaN";
//   } else if (result == null) {
//     result = "null";
//   }
//   res.json({ result: result });
// });


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV == "test") {
  mongoURL = process.env.MONGO_URI_TEST;
}
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(mongoURL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

// module.exports = { app };
