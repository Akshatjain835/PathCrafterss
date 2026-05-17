import jwt from "jsonwebtoken";

// Accept token from: Authorization: Bearer <token>, cookie 'token', or 'x-access-token' header
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const cookieToken = req.cookies?.token;
    const headerToken = req.headers["x-access-token"];
//console.log("in auth")
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (cookieToken) {
      token = cookieToken;
    } else if (headerToken) {
      token = headerToken;
    }
//console.log("after token extraction:", token);
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
//console.log("after token get:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach minimal user info to the request
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};

export default authMiddleware;
