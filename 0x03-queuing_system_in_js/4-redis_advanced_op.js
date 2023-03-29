import { print } from 'redis';
import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis client not connected to the server:', err.toString()));

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const setAll = () => {
  client.HSET('HolbertonSchools', 'Portland', 50, print);
  client.HSET('HolbertonSchools', 'Seattle', 80, print);
  client.HSET('HolbertonSchools', 'New York', 20, print);
  client.HSET('HolbertonSchools', 'Bogota', 20, print);
  client.HSET('HolbertonSchools', 'Cali', 40, print);
  client.HSET('HolbertonSchools', 'Paris', 2, print);
};

const getAll = () => {
  client.HGETALL('HolbertonSchools', (error, reply) => {
    console.log(reply);
  });
};

setAll();
getAll();
