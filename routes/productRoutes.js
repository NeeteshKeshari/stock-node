const express = require('express');
const router = express.Router();
const Product = require("../models/product");

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    const {
        selectedProduct,
        quantity,
        actualCost,
        sellingCost,
        date,
        packingCharge,
        pouchCharge,
        transportCharge,
        extraCharge,
        pisaiCharge
    } = req.body;

    try {
        const newProduct = new Product({
            selectedProduct,
            quantity,
            actualCost,
            sellingCost,
            date,
            packingCharge,
            pouchCharge,
            transportCharge,
            extraCharge,
            pisaiCharge
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create product', error });
    }
});

// PUT to update a product by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error });
    }
});

// DELETE a product
router.delete('/:id', async (req, res) => { // Removed the "products/" from the path
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete product', error });
    }
});
  
module.exports = router;
