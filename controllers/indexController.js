import { ObjectId } from "mongodb";
import db from "../models/index.js";

function getHome(req, res) {
  res.json(
    "Welcome to FixMate API! Send request to proper route to get response.",
  );
}

async function getMyServices(req, res) {
  const userData = req.user;
  const resData = await db.services
    .aggregate([
      { $match: { userId: new ObjectId(userData.id) } },
      {
        $lookup: {
          from: "user",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .toArray();
  res.json(resData);
}

async function getMyBookings(req, res) {
  const userData = req.user;
  const resData = await db.bookings
    .aggregate([
      { $match: { customerId: new ObjectId(userData.id) } },
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
    ])
    .toArray();
  res.json(resData);
}

async function getMyRequests(req, res) {
  try {
    const userData = req.user;
    const resData = await db.bookings
      .aggregate([
        {
          $match: {
            technicianId: new ObjectId(userData.id),
            status: { $ne: "cancelled" },
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
      ])
      .toArray();

    res.json(resData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
}

export default { getHome, getMyServices, getMyBookings, getMyRequests };
