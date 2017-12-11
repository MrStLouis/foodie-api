
import * as express from 'express';
import * as path from 'path';
import * as session from 'express-session';
import * as redis from 'redis';
import * as bodyParser from 'body-parser';
import * as Redis from 'connect-redis';
import * as mongoose from 'mongoose';

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log(process.env);
mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGO_CONNECT,
  { useMongoClient: true },
);

import isLoggedIn from './middleware/isLoggedIn';

import catalog from './routes/catalog';
import login from './routes/login';
import signup from './routes/signup';
import logout from './routes/logout';
import search from './search-worker/controllers/searchKeyword'

const RedisStore = Redis(session);

const app = express();
const client = redis.createClient();

const PORT = process.env.PORT || 4420;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(session({
  secret: process.env.SESSION_SECRET || 'get dat paper yo',
  saveUninitialized: false,
  resave: false,
  store: new RedisStore({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    ttl: 3600,
    client,
  }),
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

// routes
app.get('/search', search);
app.post('/login', login);
app.post('/logout', logout);
app.post('/signup', signup);
app.use('/api', isLoggedIn, catalog);

app.use((req, res) => {
  res.status(404).send('LUL wrong page');
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
