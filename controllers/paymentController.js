import { ObjectId } from "mongodb";
import db from "../models/index.js";
import {
  customerLookup,
  serviceLookup,
  technicianLookup,
} from "../utils/lookups.js";

async function create(req, res) {
  const reqBody = req.body;
  reqBody.bookingId = new ObjectId(reqBody.bookingId);
  reqBody.customerId = new ObjectId(reqBody.customerId);
  reqBody.technicianId = new ObjectId(reqBody.technicianId);
  reqBody.serviceId = new ObjectId(reqBody.serviceId);
  const resData = await db.payments.insertOne(reqBody);
  res.json(resData);
}

async function listUserPayments(req, res) {
  const userId = req.user.id;
  const resData = await db.payments
    .aggregate([
      { $match: { customerId: new ObjectId(userId) } },
      ...serviceLookup(),
      ...technicianLookup(),
      ...customerLookup(),
    ])
    .toArray();

  res.json(resData);
}

export default { create, listUserPayments };
