import { ObjectId } from "mongodb";
import db from "../models/index.js";

async function updateNewUser(req, res) {
  const userData = req.user;
  const userId = userData.id;
  const resData = await db.user.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { approval: "pending", status: "approved" } },
  );
  res.json(resData);
}

export default { updateNewUser };
