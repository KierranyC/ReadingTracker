import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';


const server = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

server.use(express.static(path.join(__dirname, '../frontend/build')));

server.use(morgan('dev')); // logging
server.use(express.json()); // json parsing

// api

server.use('/api', apiRouter);

server.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// connect to server

const PORT = process.env.PORT || 4000;

// define server handle to close open tcp connection after unit tests have run

const handle = server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}!`);

  try {
    await client.connect();
    console.log('Database is open for business!');
  } catch (error) {
    console.error('Database is closed for repairs!\n', error);
  }
});

// export server and handle

export { server, handle };