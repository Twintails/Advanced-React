const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });
const createYogaServer = require('./createServer');
const db = require('./db');

const yoga = createYogaServer();

// NOTE: Use express middlware to handle cookies (JWT)
yoga.express.use(cookieParser())

// NOTE: decode the JWT so we can get the user ID
yoga.express.use((req, res, next) => {
  const { token } = req.cookies
  if (token) {
    const {userId} = jwt.verify(token, process.env.APP_SECRET)
    req.userId = userId
  }

  next()
})

yoga.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  deets => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
