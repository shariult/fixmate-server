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

export default { store };
