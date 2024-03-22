require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid authorization header format' });
  }

  const token = authHeader.slice(7);

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(403).json({status: "error", message: "Token Expired"});
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({status: "error", message: "Token not found"});
  }
};

module.exports = {authenticateJWT};
