import { print } from 'redis';
import { createClient } from 'redis';
import { promisify } from 'util';
const express = require('express');

const client = createClient();
client.get = promisify(client.get);

const listProducts = [
  {
    id: 1, name: 'Suitcase 250', price: 50, stock: 4
  },
  {
    id: 2, name: 'Suitcase 450', price: 100, stock: 10
  },
  {
    id: 3, name: 'Suitcase 650', price: 350, stock: 2
  },
  {
    id: 4, name: 'Suitcase 1050', price: 550, stock: 5
  }
];

const getItemById = (id) => {
  const item = listProducts.find((product) => product.id == id);
  return item;
};

const reserveStockById = (itemId, stock) => {
  client.INCRBY(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const reply = await client.get(`item.${itemId}`);
  return reply;
}

const server = express();
const port = 1245;

server.get('/list_products', (req, res) => {
  const products = [];
  listProducts.forEach((product) => {
    const item = {
      itemId: product.id,
      itemName: product.name,
      price: product.price,
      initialAvailableQuantity: product.stock
    };
    products.push(item);
  });
  res.send(JSON.stringify(products));
});

server.get('/list_products/:itemId', async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const product = getItemById(itemId);
  const reservedStock = await getCurrentReservedStockById(itemId);
  if (!reservedStock) {
    reservedStock = 0;
  }
  if (product) {
    const item = {
      itemId: product.id,
      itemName: product.name,
      price: product.price,
      initialAvailableQuantity: product.stock,
      currentQuantity: product.stock - reservedStock
    }
    res.send(JSON.stringify(item));
  } else {
    res.send(JSON.stringify({"status":"Product not found"}));
  }
});

server.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const product = getItemById(itemId);
  const reservedStock = await getCurrentReservedStockById(itemId);
  if (!reservedStock) {
    const reservedStock = 0;
  }
  if (!product) {
    res.send(JSON.stringify({"status":"Product not found"}));
  } else if ((product.stock - reservedStock) < 1) {
    res.send(JSON.stringify({"status":"Not enough stock available","itemId":1}));
  } else {
    reserveStockById(itemId, 1);
    res.send(JSON.stringify({"status":"Reservation confirmed","itemId":1}));
  }
})

server.listen(port);
