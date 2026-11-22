import { createRemoteJWKSet, jwtVerify } from "jose";

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Please sign in first!" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Please sign in first!" });
  }

  const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`),
  );

  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication went wrong!" });
  }
}

async function verifyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(401).json({ message: "You are not an Admin!" });
  }
  next();
}

async function verifyTechnician(req, res, next) {
  if (req.user.role !== "technician") {
    return res.status(401).json({ message: "You are not a technician!" });
  }
  next();
}

async function verifyCustomer(req, res, next) {
  if (req.user.role !== "customer") {
    return res.status(401).json({ message: "You are not a customer!" });
  }
  next();
}

export { verifyToken, verifyAdmin, verifyTechnician, verifyCustomer };
