const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "❌ Access Denied! No valid Token Provided" });
    }

    // Extract the actual token (remove "Bearer ")
    const token = authHeader.split(" ")[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
        req.user = verified; // `verified` contains `{ userId: "..." }`
        next();
    } catch (err) {
        res.status(403).json({ error: "❌ Invalid or Expired Token" });
    }
};

module.exports = authMiddleware;
