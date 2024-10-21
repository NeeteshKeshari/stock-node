const express = require('express');
const router = express.Router();
const Customer = require("../models/customer");
const { authenticateToken } = require('../middleware/auth'); // Import the authentication middleware

// GET all customers
router.get('/', authenticateToken, async (req, res) => {
    try {
        const customer = await Customer.find();
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch customers', error });
    }
});


// POST a new customer
router.post('/', authenticateToken, async (req, res) => {
    const { customerName, customerAddress } = req.body;

    try {
        const newCustomer = new Customer({
            customerName,
            customerAddress,
        });

        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create customer', error });
    }
});

// PUT to update a customer by ID
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update customer', error });
    }
});

// DELETE a customer
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete customer', error });
    }
});

module.exports = router;
