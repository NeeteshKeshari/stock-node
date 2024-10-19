const express = require('express');
const router = express.Router();
const Entry = require("../models/entry");

// GET all entry items
router.get('/', async (req, res) => {
    try {
        const entry = await Entry.find();
        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch entry', error });
    }
});

// POST a new entry item
router.post('/', async (req, res) => {
    const { productName, quantity, userNum, approvalStatus, number, date } = req.body;

    try {
        const newEntry = new Entry({
            productName,
            quantity,
            userNum, 
            approvalStatus,
            number,
            date,
        });

        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create entry item', error });
    }
});

// PUT to update a entry item by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedEntry = await Entry.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update entry', error });
    }
});

// DELETE a entry item
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEntry = await Entry.findByIdAndDelete(id);
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Entry not found' });
        }
        res.status(200).json({ message: 'Entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete entry', error });
    }
});

module.exports = router;
