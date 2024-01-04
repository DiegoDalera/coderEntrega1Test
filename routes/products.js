const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager.class');
const productManager = new ProductManager('products.json');



// Ruta raíz GET /api/products/

router.get('/', async (req, res) => {
  let { limit } = req.query;
  try {
    const products = await productManager.getProducts();
    if (limit) {
      res.send(products.slice(0, parseInt(limit)));
    } else {
      res.send(products);
    }
  } catch (err) {
    res.status(500).send('Error al obtener productos');
  }
});



// Ruta GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductById(productId);
  res.json(product);
});

// Ruta raíz POST /api/products/
router.post('/', async (req, res) => {
  const { title, description, price,category, thumbnail, code, stock } = req.body;
  await productManager.addProduct({ title, description,category, price, thumbnail, code, stock });
  res.json({ message: 'Producto agregado con éxito' });
});

// Ruta PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid)
  
  const updatedProduct = req.body;
  await productManager.updateProduct(productId, updatedProduct);
  res.json({ message: 'Producto actualizado con éxito' });
});

// Ruta DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  const productId = parseInt(req.params.pid);
  await productManager.deleteProduct(productId);
  res.json({ message: 'Producto eliminado con éxito' });
  
  const products = await productManager.getProducts();
  res.send(products);
});

module.exports = router;

