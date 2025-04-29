const jwt = require("jsonwebtoken");

const generateToken = (userId, isAdmin) => {
  return jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: "30d", // token will expire in 1 day
  });
};

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Get token from the Authorization header

  if (!token) {
    return res.status(401).json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token is not valid" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next(); // If the user is admin, proceed to the route
  } else {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
};

module.exports = { generateToken, verifyToken, isAdmin };
