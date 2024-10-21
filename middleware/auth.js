const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Get the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the secret from your .env file
        req.user = decoded; // Attach the decoded payload (user info) to the request object
        next(); // Call next to move to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Invalid token.' });
    }
}

module.exports = { authenticateToken };
