import { ObjectId } from "mongodb";
import db from "../models/index.js";
import {
  customerLookup,
  serviceLookup,
  technicianLookup,
  userLookup,
} from "../utils/lookups.js";

async function listUsers(req, res) {
  const resData = await db.user.find().toArray();
  const users = resData.map((item) => {
    return { ...item, id: item._id };
  });
  res.json(users);
}
async function listPayments(req, res) {
  const resData = await db.payments
    .aggregate([
      { $match: {} },
      ...serviceLookup(),
      ...technicianLookup(),
      ...customerLookup(),
    ])
    .toArray();

  res.json(resData);
}

async function listServices(req, res) {
  const searchQuery = {};

  const resData = await db.services
    .aggregate([{ $match: searchQuery }, ...userLookup()])
    .sort({ createdAt: -1 })
    .toArray();
  res.json(resData);
}

async function listBookings(req, res) {
  const filter = req.query.filter;

  const dbQuery = {};

  const resData = await db.bookings
    .aggregate([
      { $match: dbQuery },
      { $sort: { createdAt: -1 } },
      ...serviceLookup(),
      ...technicianLookup(),
      ...customerLookup(),
    ])
    .toArray();

  res.json(resData);
}

async function updateUserRole(req, res) {
  const userId = req.params.uId;
  const reqBody = req.body;

  const resData = await db.user.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: reqBody.role } },
  );
  res.json(resData);
}

async function updateServiceApproval(req, res) {
  const sId = req.params.sId;
  const approvalStatus = req.body.approvalStatus;
  const resData = await db.services.updateOne(
    { _id: new ObjectId(sId) },
    { $set: { approvalStatus } },
  );
  res.json(resData);
}

export default {
  listUsers,
  listBookings,
  listPayments,
  listServices,
  updateUserRole,
  updateServiceApproval,
};
