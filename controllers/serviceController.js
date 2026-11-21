import { ObjectId } from "mongodb";
import slugify from "slugify";
import db from "../models/index.js";

async function store(req, res) {
  const reqBody = req.body;
  const userData = req.user;
  const service = {
    ...reqBody,
    slug: slugify(req.body.title),
    userId: new ObjectId(userData._id),
    status: "approved",
    approved: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const resData = await db.services.insertOne(service);
  res.json(resData);
}

export default { store };
