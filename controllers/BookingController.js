import { ObjectId } from "mongodb";
import db from "../models/index.js";
import {
  customerLookup,
  serviceLookup,
  technicianLookup,
} from "../utils/lookups.js";
import { ExpressError } from "../utils/errorHandler.js";

async function create(req, res) {
  const reqBody = req.body;
  if (!reqBody.serviceId) {
    throw new ExpressError("Invalid data provided!");
  }

  const service = await db.services.findOne({
    _id: new ObjectId(reqBody.serviceId),
  });
  const customerData = req.user;
  if (!service || !customerData) {
    throw new ExpressError("Invalid data provided!");
  }

  // check for duplicate request
  const prevBooking = await db.bookings.findOne({
    customerId: new ObjectId(req.user.id),
    serviceId: new ObjectId(service._id),
    preferredDate: reqBody.preferredDate,
  });
  if (prevBooking) {
    throw new ExpressError("You have already a booking on this day!");
  }

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

async function listCustomer(req, res) {
  const userData = req.user;
  const resData = await db.bookings
    .aggregate([
      { $match: { customerId: new ObjectId(userData.id) } },
      ...customerLookup(),
      ...technicianLookup(),
      ...serviceLookup(),
    ])
    .toArray();
  res.json(resData);
}

async function cancel(req, res) {
  const bId = req.params.bId;
  const userId = req.user.id;
  const resData = await db.bookings.updateOne(
    { _id: new ObjectId(bId), customerId: new ObjectId(userId) },
    { $set: { status: "cancelled" } },
  );
  res.json(resData);
}

async function listTechnician(req, res) {
  const userData = req.user;
  const resData = await db.bookings
    .aggregate([
      {
        $match: {
          technicianId: new ObjectId(userData.id),
          status: { $ne: "cancelled" },
        },
      },
      ...serviceLookup(),
      ...customerLookup(),
      ...technicianLookup(),
    ])
    .toArray();

  res.json(resData);
}

async function updateStatus(req, res) {
  const bId = req.params.bId;
  const reqBody = req.body;
  const resData = await db.bookings.updateOne(
    { _id: new ObjectId(bId) },
    { $set: { status: reqBody.status } },
  );
  res.json(resData);
}

async function get(req, res) {
  const bId = req.params.bId;
  const resData = await db.bookings
    .aggregate([
      { $match: { _id: new ObjectId(bId) } },
      ...serviceLookup(),
      ...technicianLookup(),
      ...customerLookup(),
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

export default {
  create,
  listCustomer,
  cancel,
  listTechnician,
  updateStatus,
  get,
  update,
};
