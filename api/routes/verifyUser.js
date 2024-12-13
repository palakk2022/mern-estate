import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token
  
  if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
  }
  
  //console.log("Received token:", token); // Add this log for debugging

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
  } catch (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

