const express = require('express');
const router = express.Router();
const Stock = require("../models/stock");
const { authenticateToken } = require('../middleware/auth');

// GET all stock items
router.get('/', authenticateToken, async (req, res) => {
    try {
        const stock = await Stock.find();
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stocks', error });
    }
});

// POST a new stock item
router.post('/', authenticateToken, async (req, res) => {
    const { rawMaterialName, quantity, price, date } = req.body;

    try {
        const newStock = new Stock({
            rawMaterialName,
            quantity,
            price,
            date,
        });

        const savedStock = await newStock.save();
        res.status(201).json(savedStock);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create stock item', error });
    }
});

// PUT to update a stock item by ID
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedStock = await Stock.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedStock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.json(updatedStock);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update stock', error });
    }
});

// DELETE a stock item
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedStock = await Stock.findByIdAndDelete(id);
        if (!deletedStock) {
            return res.status(404).json({ message: 'Stock not found' });
        }
        res.status(200).json({ message: 'Stock deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete stock', error });
    }
});

module.exports = router;
