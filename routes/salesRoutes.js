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

    // Ensure enough quantity before proceeding
    if (product.quantity < soldQuantity) {
        throw new Error(`Insufficient quantity for product: ${product.name}`);
    }

    product.quantity -= soldQuantity;
    await product.save();
};

// POST a new sale with multiple products
router.post('/', authenticateToken, async (req, res) => {
    const {
        productList,
        date,
        customerName,
        customerAddress,
        amountPaid,
        amountDue,
        totalDue
    } = req.body;

    try {
        const saleItems = [];
        
        for (const item of productList) {
            const { product, productId, quantity, cost } = item;
            const allProducts = await Product.find({});
            console.log('All products in the collection:', allProducts);
            
            const productToUpdate = await Product.findOne({ _id: productId });
            console.log(product, productToUpdate);
            if (!productToUpdate) {
                return res.status(404).json({ message: `Product ${product} not found` });
            }

            // Check if quantity is sufficient
            if (productToUpdate.quantity < quantity) {
                return res.status(400).json({ message: `Insufficient quantity for product: ${product}` });
            }

            // Deduct the quantity
            await adjustProductQuantity(productToUpdate._id, quantity);

            saleItems.push({
                product,
                productId: productToUpdate._id,
                quantity,
                cost,
            });
        }

        // Create the sale
        const newSale = new Sales({
            productList: saleItems,
            date,
            customerName,
            customerAddress,
            amountPaid: amountPaid.map(payment => ({
                amount: payment.amount,
                date: payment.date
            })),
            amountDue,
            totalDue
        });

        console.log(newSale);

        const savedSale = await newSale.save();
        console.log(savedSale);
        res.status(201).json(savedSale);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create sale', error });
    }
});

// PUT to update a sale by ID
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const {
        productList,
        date,
        customerName,
        customerAddress,
        amountPaid,
        amountDue,
        totalDue
    } = req.body;

    try {
        const existingSale = await Sales.findById(id);
        if (!existingSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Adjust quantities based on the difference for each product
        for (const item of productList) {
            const { product, quantity } = item;

            const productToUpdate = await Product.findOne({ name: product });
            if (!productToUpdate) {
                return res.status(404).json({ message: `Product ${product} not found` });
            }

            const existingItem = existingSale.productList.find(p => p.product === product);
            const quantityDifference = quantity - (existingItem ? existingItem.quantity : 0);

            // Adjust product quantity
            if (quantityDifference !== 0) {
                await adjustProductQuantity(productToUpdate._id, Math.abs(quantityDifference));
            }
        }

        // Update sale details
        const updatedSale = await Sales.findByIdAndUpdate(
            id,
            {
                productList,
                date,
                customerName,
                customerAddress,
                amountPaid: amountPaid.map(payment => ({
                    amount: payment.amount,
                    date: payment.date
                })),
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

// DELETE a sale and adjust product quantities back
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSale = await Sales.findByIdAndDelete(id);
        if (!deletedSale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Adjust product quantities back
        for (const item of deletedSale.productList) {
            const productToUpdate = await Product.findById(item.productId);
            if (productToUpdate) {
                productToUpdate.quantity += item.quantity;
                await productToUpdate.save();
            }
        }

        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        console.error('Error deleting sale:', error.message);
        res.status(500).json({ message: 'Failed to delete sale', error });
    }
});

module.exports = router;
