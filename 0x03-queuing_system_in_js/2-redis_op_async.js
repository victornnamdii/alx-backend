import { print } from 'redis';
import { createClient } from 'redis';
import { promisify } from 'util';

const client = createClient();
client.get = promisify(client.get)

client.on('error', err => console.log('Redis client not connected to the server:', err.toString()));

const setNewSchool = (schoolName, value) => {
  client.SET(schoolName, value, print)
};

const displaySchoolValue = async (schoolName) => {
  const reply = await client.get(schoolName);
  console.log(reply)
};

async function main() {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
}

client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
});
