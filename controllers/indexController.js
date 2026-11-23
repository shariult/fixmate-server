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

export default { getHome, seed };
