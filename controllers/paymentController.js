import { ObjectId } from "mongodb";
import db from "../models/index.js";

async function index(req, res) {
  const userId = req.user.id;
  const resData = await db.payments
    .aggregate([
      { $match: { customerId: new ObjectId(userId) } },
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "serviceDetails",
        },
      },
      {
        $unwind: {
          path: "$serviceDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "technicianId",
          foreignField: "_id",
          as: "technicianDetails",
        },
      },
      {
        $unwind: {
          path: "$technicianDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "user",
          localField: "customerId",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: {
          path: "$customerDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .toArray();
  console.log(resData);
  res.json(resData);
}

async function store(req, res) {
  const reqBody = req.body;
  reqBody.bookingId = new ObjectId(reqBody.bookingId);
  reqBody.customerId = new ObjectId(reqBody.customerId);
  reqBody.technicianId = new ObjectId(reqBody.technicianId);
  reqBody.serviceId = new ObjectId(reqBody.serviceId);
  const resData = await db.payments.insertOne(reqBody);
  res.json(resData);
}

export default { index, store };
