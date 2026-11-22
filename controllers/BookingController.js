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

async function cancel(req, res) {
  const bId = req.params.bId;
  const resData = await db.bookings.updateOne(
    { _id: new ObjectId(bId) },
    { $set: { status: "cancelled" } },
  );
  res.json(resData);
}

export default { store, cancel };
