import db from "../models/index.js";
import { userLookup } from "../utils/lookups";

async function listServices(req, res) {
  const searchQuery = {};

  const resData = await db.services
    .aggregate([{ $match: searchQuery }, ...userLookup()])
    .sort({ createdAt: -1 })
    .toArray();
  res.json(resData);
}

export { listServices };
