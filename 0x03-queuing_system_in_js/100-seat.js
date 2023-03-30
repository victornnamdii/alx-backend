import { createClient } from 'redis';
import { promisify } from 'util';
import { createQueue } from 'kue';

const express = require('express');

const client = createClient();
const queue = createQueue();
client.get = promisify(client.get);

client.on('error', err => console.log('Redis client not connected to the server:', err.toString()));

const reserveSeat = (number) => {
  client.set('available_seats', number);
}

const getCurrentAvailableSeats = async () => {
  const availableSeats = await client.get('available_seats');
  return availableSeats;
}

let reservationEnabled = true;

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const server = express();
const port = 1245;

server.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({
    numberOfAvailableSeats: availableSeats
  });
});

server.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ "status": "Reservation are blocked" });
  } else {
    const job = queue.create('reserve_seat');

    job
      .on('complete', () => {
        console.log(`Seat reservation job ${job.id} completed`);
      })
      .on('failed', (err) => {
        console.log(`Seat reservation job ${job.id} failed: ${err.toString()}`);
      });
    
      job.save((err) => {
        if (err) {
          res.json({ "status": "Reservation failed" });
        } else {
          res.json({ "status": "Reservation in process" });
        }
      });
  }
});

server.get('/process', (req, res) => {
  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats < 1) {
      reservationEnabled = false;
      done(new Error('Not enough seats available'));
    } else {
      reserveSeat(availableSeats - 1);
    }
    done();
  });
  res.json({ "status": "Queue processing" });
});


server.listen(port, () => {
  reserveSeat(50);
  console.log(`Server started on port ${port}`);
});
