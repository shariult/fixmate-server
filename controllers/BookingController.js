import { ObjectId } from "mongodb";
import slugify from "slugify";
import db from "../models/index.js";

async function store(req, res) {
  const reqBody = req.body;

  const service = await db.services.findOne({
    _id: new ObjectId(reqBody.serviceId),
  });
  const customerData = req.user;

  const booking = {
    ...reqBody,
    serviceId: service._id,
    customerId: new ObjectId(customerData.id),
    technicianId: new ObjectId(service.userId),
    status: "requested",
    paymentId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const resData = await db.bookings.insertOne(booking);
  res.json(resData);
}

async function show(req, res) {
  const bId = req.params.bId;
  const resData = await db.bookings
    .aggregate([
      { $match: { _id: new ObjectId(bId) } },
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
  res.json(resData[0]);
}

async function update(req, res) {
  const bId = req.params.bId;
  const reqBody = req.body;

  const resData = await db.bookings.updateOne(
    { _id: new ObjectId(bId) },
    { $set: reqBody },
  );
  res.json(resData);
}

async function cancel(req, res) {
  const bId = req.params.bId;
  const resData = await db.bookings.updateOne(
    { _id: new ObjectId(bId) },
    { $set: { status: "cancelled" } },
  );
  res.json(resData);
}

async function status(req, res) {
  const bId = req.params.bId;
  const reqBody = req.body;
  const resData = await db.bookings.updateOne(
    { _id: new ObjectId(bId) },
    { $set: reqBody },
  );
  res.json(resData);
}

async function userPayments(req, res) {
  const userId = new ObjectId(req.user.id);
  const filter = req.query.filter;

  const dbQuery = { customerId: userId };

  if (filter === "paid") {
    dbQuery.paymentId = { $exists: true, $nin: ["", null] };
  }

  const resData = await db.bookings
    .aggregate([
      { $match: dbQuery },
      { $sort: { createdAt: -1 } },
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

  res.json(resData);
}

async function indexAdmin(req, res) {
  const filter = req.query.filter;

  const dbQuery = {};

  const resData = await db.bookings
    .aggregate([
      { $match: dbQuery },
      { $sort: { createdAt: -1 } },
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

  res.json(resData);
}

export default {
  indexAdmin,
  store,
  show,
  update,
  cancel,
  status,
  userPayments,
};
