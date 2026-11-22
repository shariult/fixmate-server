import { ObjectId } from "mongodb";
import db from "../models/index.js";
import { servicesDemo } from "../seeds/services.js";

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

async function seed(req, res) {
  const dropServices = await db.services.drop();
  const dropBookings = await db.bookings.drop();
  const dropPayments = await db.payments.drop();

  const technicians = await db.user.find({ role: "technician" }).toArray();
  const services = servicesDemo.map((item) => {
    const user = technicians[Math.floor(Math.random() * technicians.length)];
    return {
      ...item,
      userId: new ObjectId(user._id),
    };
  });

  const resData = await db.services.insertMany(services);
  res.json(resData);
}

export default { getHome, getMyServices, getMyBookings, getMyRequests, seed };
