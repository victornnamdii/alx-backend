import { print } from 'redis';
import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis client not connected to the server:', err.toString()));

client.on('connect', () => {
  console.log('Redis client connected to the server')
});

const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, print)
};

const displaySchoolValue = (schoolName) => {
  client.GET(schoolName, (error, reply) => {
    console.log(reply);
  });
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
