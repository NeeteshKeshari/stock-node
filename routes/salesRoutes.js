const express = require('express');
const router = express.Router();
const Sales = require("../models/sales"); // Ensure this matches your model name

// GET all sales
router.get('/', async (req, res) => {
    try {
        const sales = await Sales.find();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sales', error });
    }
});

// POST a new sale
router.post('/', async (req, res) => {
    const {
        product,
        quantity,
        cost,
        date,
        customerName,
        customerAddress,
        amountPaid,
        amountDue,
        totalDue
    } = req.body;

    try {
        const newSale = new Sales({  // Use Sales here, not Sale
            product,
            quantity,
            cost,
            date,
            customerName,
            customerAddress,
            amountPaid,
            amountDue,
            totalDue
        });

        const savedSale = await newSale.save();
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create sale', error });
    }
});

// PUT to update a sale by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedSale = await Sales.findByIdAndUpdate(id, updates, { new: true }); // Use Sales here, not Sale
        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.json(updatedSale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update sale', error });
    }
});

// DELETE a sale
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSale = await Sales.findByIdAndDelete(id);
        if (!deletedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete sale', error });
    }
});

module.exports = router;
