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

export default { getHome, getMyServices };
