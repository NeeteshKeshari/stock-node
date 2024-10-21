const express = require('express');
const router = express.Router();
const Sales = require("../models/sales");
const { authenticateToken } = require('../middleware/auth');

// GET all sales
router.get('/', authenticateToken, async (req, res) => {
    try {
        const sales = await Sales.find();
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sales', error });
    }
});

// POST a new sale
router.post('/', authenticateToken, async (req, res) => {
    const {
        product,
        quantity,
        cost,
        date,
        customerName,
        customerAddress,
        amountPaid,  // Expecting an array of objects [{ amount: Number, date: Date }]
        amountDue,
        totalDue
    } = req.body;

    try {
        const newSale = new Sales({
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
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
        product,
        quantity,
        cost,
        date,
        customerName,
        customerAddress,
        amountPaid,  // Allow updating the payments array
        amountDue,
        totalDue
    } = req.body;

    try {
        const updatedSale = await Sales.findByIdAndUpdate(
            id, 
            {
                product,
                quantity,
                cost,
                date,
                customerName,
                customerAddress,
                amountPaid,
                amountDue,
                totalDue
            },
            { new: true }
        );

        if (!updatedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.json(updatedSale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update sale', error });
    }
});

// DELETE a sale
router.delete('/:id', authenticateToken, async (req, res) => {
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
