import { ObjectId } from "mongodb";
import db from "../models/index.js";
import { servicesDemo } from "../seeds/services.js";

function getHome(req, res) {
  res.json(
    "Welcome to FixMate API! Send request to proper route to get response.",
  );
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

async function getCustomerDash(req, res) {
  const customerId = req.user.id;

  const now = new Date();
  const monthsStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1),
  );

  const [data] = await db.bookings
    .aggregate([
      { $match: { customerId: new ObjectId(customerId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [
                { $in: ["$status", ["requested", "accepted", "in-progress"]] },
                1,
                0,
              ],
            },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
      { $project: { _id: 0 } },
    ])
    .toArray();
  res.json(data);
}

async function getTechnicianDash(req, res) {
  const technicianId = new ObjectId(req.user.id);

  const [serviceStats, pendingRequests] = await Promise.all([
    db.services
      .aggregate([
        { $match: { userId: technicianId } },
        {
          $group: {
            _id: null,
            totalServices: { $sum: 1 },
            approvedServices: {
              $sum: { $cond: [{ $eq: ["$approvalStatus", "approved"] }, 1, 0] },
            },
          },
        },
        { $project: { _id: 0 } },
      ])
      .toArray(),

    db.bookings.countDocuments({
      technicianId,
      status: "requested",
    }),
  ]);
  const stats = {
    totalServices: serviceStats[0]?.totalServices ?? 0,
    approvedServices: serviceStats[0]?.approvedServices ?? 0,
    pendingRequests,
  };
  res.json(stats);
}

async function getAdminDash(req, res) {
  const [totalUsers, totalTechnicians, pendingServices, revenueResult] =
    await Promise.all([
      db.user.countDocuments(),

      db.user.countDocuments({ role: "technician" }),

      db.services.countDocuments({ approvalStatus: "pending" }),

      db.payments
        .aggregate([
          { $match: { paymentStatus: "paid" } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$amount" },
              paidJobs: { $sum: 1 },
            },
          },
          { $project: { _id: 0 } },
        ])
        .toArray(),
    ]);

  const stats = {
    totalUsers,
    totalTechnicians,
    pendingServices,
    totalRevenue: revenueResult[0]?.totalRevenue ?? 0,
    paidJobs: revenueResult[0]?.paidJobs ?? 0,
  };
  res.json(stats);
}

export default {
  getHome,
  seed,
  getCustomerDash,
  getTechnicianDash,
  getAdminDash,
};
