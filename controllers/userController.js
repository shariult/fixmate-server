import { ObjectId } from "mongodb";
import db from "../models/index.js";

async function index(req, res) {
  const resData = await db.user.find().toArray();
  res.json(resData);
}

async function updateUserRole(req, res) {
  const userId = req.params.uId;
  const reqBody = req.body;

  const resData = await db.user.updateOne(
    { _id: new ObjectId(userId) },
    { $set: reqBody },
  );
  res.json(resData);
}

async function updateNewUser(req, res) {
  const userData = req.user;
  const userId = userData.id;
  const reqBody = { approval: "pending", status: "approved" };

  if (userData.role === "customer") {
    reqBody.approval = "approved";
  }

  const resData = await db.user.updateOne(
    { _id: new ObjectId(userId) },
    { $set: reqBody },
  );
  res.json(resData);
}

export default { index, updateUserRole, updateNewUser };
