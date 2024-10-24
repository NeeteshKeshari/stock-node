const express = require('express');
const router = express.Router();
const Sales = require("../models/sales");
const Product = require("../models/product");
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

// Adjust product quantity based on sold quantity
const adjustProductQuantity = async (productId, soldQuantity) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Product not found');
    }

    // Ensure that the product has enough quantity before proceeding
    if (product.quantity < soldQuantity) {
        throw new Error('Not enough product quantity available');
    }

    // Decrease the product quantity
    product.quantity -= soldQuantity;
    await product.save();
};

// POST a new sale
router.post('/', authenticateToken, async (req, res) => {
    const {
        product,
        productId,
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
        // Find the product by ID
        const productToUpdate = await Product.findById(productId);

        if (!productToUpdate) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the quantity in the product is sufficient
        if (productToUpdate.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient product quantity' });
        }

        // Create the new sale
        const newSale = new Sales({
            product,
            productId,
            quantity,
            cost,
            date,
            customerName,
            customerAddress,
            amountPaid,
            amountDue,
            totalDue
        });

        // Save the new sale
        const savedSale = await newSale.save();

        // Update the product quantity
        productToUpdate.quantity -= quantity; // Decrease product quantity
        await productToUpdate.save(); // Save the updated product

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
        productId,
        quantity,
        cost,
        date,
        customerName,
        customerAddress,
        amountPaid,
        amountDue,
        totalDue
    } = req.body;

    console.log('Updating sale with ID:', id);
    console.log('Data:', req.body);

    try {
        const existingSale = await Sales.findById(id);
        if (!existingSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Calculate the quantity difference
        const quantityDifference = quantity - existingSale.quantity;

        console.log('Existing sale found:', existingSale);
        console.log('Quantity difference:', quantityDifference);

        // Adjust the product quantity based on the change
        if (quantityDifference !== 0) {
            await adjustProductQuantity(productId, Math.abs(quantityDifference));
        }

        const updatedSale = await Sales.findByIdAndUpdate(
            id,
            {
                product,
                productId,
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

        res.json(updatedSale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update sale', error: error.message });
    }
});

// DELETE a sale
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; // This should be the sale ID, not product ID
    console.log('Deleting sale with ID:', id);

    try {
        // Attempt to find and delete the sale using the correct ID
        const deletedSale = await Sales.findByIdAndDelete(id);
        if (!deletedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Adjust the product quantity back based on the deleted sale
        const productToUpdate = await Product.findById(deletedSale.productId);
        if (productToUpdate) {
            productToUpdate.quantity += deletedSale.quantity; // Add back the quantity
            await productToUpdate.save();
        }

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('Error deleting sale:', error.message);
        res.status(500).json({ message: 'Failed to delete sale', error });
    }
});


module.exports = router;
