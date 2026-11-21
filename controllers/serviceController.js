import { ObjectId } from "mongodb";
import slugify from "slugify";
import db from "../models/index.js";
import { servicesDemo } from "../seeds/services.js";

async function index(req, res) {
  const {
    type: typeQuery,
    category,
    servicemode: serviceMode,
    sort,
    search,
  } = req.query;

  //=== featured ===//
  if (typeQuery === "featured") {
    const resData = await db.services
      .aggregate([
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
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();
    res.json(resData);
    return;
  }

  //=== general ===//
  if (category) {
    searchQuery.category = category;
  }
  if (serviceMode) {
    searchQuery.serviceMode = serviceMode;
  }

  const searchQuery = {};
  if (search && search.trim()) {
    searchQuery.title = {
      $regex: search.trim(),
      $options: "i",
    };
    searchQuery.description = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  let sortQuery = { createdAt: -1 };
  if (sort === "highest-price") {
    sortQuery = { basePrice: -1 };
  }
  if (sort === "lowest-price") {
    sortQuery = { basePrice: 1 };
  }

  const resData = await db.services
    .aggregate([
      { $match: searchQuery },
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
    .sort(sortQuery)
    .skip(0)
    .limit(12)
    .toArray();
  res.json(resData);
}

async function store(req, res) {
  const reqBody = req.body;
  const userData = req.user;
  const service = {
    ...reqBody,
    slug: slugify(req.body.title),
    userId: new ObjectId(userData.id),
    status: "approved",
    approval: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const resData = await db.services.insertOne(service);
  res.json(resData);
}

async function seed(req, res) {
  const dropServices = await db.services.drop();

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

export default { index, store, seed };
