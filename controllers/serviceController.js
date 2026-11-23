import { ObjectId } from "mongodb";
import slugify from "slugify";
import db from "../models/index.js";
import { userLookup } from "../utils/lookups.js";

// async function list(req, res) {
//   const { category, mode, sort, search } = req.query;

//   const searchQuery = { isAvailable: true, approvalStatus: "approved" };

//   if (category) {
//     searchQuery.category = category;
//   }
//   if (mode) {
//     searchQuery.serviceMode = mode;
//   }

//   if (search && search.trim()) {
//     const regex = { $regex: search.trim(), $options: "i" };

//     searchQuery.$or = [{ title: regex }, { description: regex }];
//   }

//   let sortQuery = { createdAt: -1 };
//   if (sort === "price_desc") {
//     sortQuery = { basePrice: -1 };
//   }
//   if (sort === "price_asc") {
//     sortQuery = { basePrice: 1 };
//   }

//   const resData = await db.services
//     .aggregate([{ $match: searchQuery }, ...userLookup()])
//     .sort(sortQuery)
//     .toArray();
//   res.json(resData);
// }

async function list(req, res) {
  const { category, mode, sort, search } = req.query;

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);
  const skip = (page - 1) * limit;
  const searchQuery = { isAvailable: true, approvalStatus: "approved" };

  if (category) {
    searchQuery.category = category;
  }
  if (mode) {
    searchQuery.serviceMode = mode;
  }

  if (search && search.trim()) {
    const regex = { $regex: search.trim(), $options: "i" };
    searchQuery.$or = [{ title: regex }, { description: regex }];
  }

  let sortQuery = { createdAt: -1 };
  if (sort === "price_desc") {
    sortQuery = { basePrice: -1 };
  }
  if (sort === "price_asc") {
    sortQuery = { basePrice: 1 };
  }

  sortQuery._id = -1;

  const [resData] = await db.services
    .aggregate([
      { $match: searchQuery },
      {
        $facet: {
          items: [
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit },
            ...userLookup(),
          ],
          total: [{ $count: "count" }],
        },
      },
    ])
    .toArray();

  const total = resData.total[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  res.json({
    items: resData.items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}

async function listFeatured(req, res) {
  const resData = await db.services
    .aggregate([
      { $match: { isAvailable: true, approvalStatus: "approved" } },
      ...userLookup(),
    ])
    .sort({ createdAt: -1 })
    .limit(6)
    .toArray();
  res.json(resData);
}

async function listTechnician(req, res) {
  const userId = req.user.id;

  const resData = await db.services
    .aggregate([{ $match: { userId: new ObjectId(userId) } }, ...userLookup()])
    .sort({ createdAt: -1 })
    .toArray();
  res.json(resData);
}

async function create(req, res) {
  const reqBody = req.body;
  const userData = req.user;
  const service = {
    ...reqBody,
    slug: slugify(req.body.title),
    userId: new ObjectId(userData.id),
    isAvailable: true,
    approvalStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const resData = await db.services.insertOne(service);
  res.json(resData);
}

async function get(req, res) {
  const sId = req.params.sId;
  const resData = await db.services
    .aggregate([{ $match: { _id: new ObjectId(sId) } }, ...userLookup()])
    .toArray();
  res.json(resData[0]);
}

async function update(req, res) {
  const sId = req.params.sId;
  const reqBody = req.body;

  if (req.user.role !== "admin") {
    reqBody.approvalStatus = "pending";
  }

  const resData = await db.services.updateOne(
    { _id: new ObjectId(sId) },
    { $set: reqBody },
  );
  res.json(resData);
}

async function updateAvailability(req, res) {
  const sId = req.params.sId;
  const resData = await db.services.updateOne(
    { _id: new ObjectId(sId) },
    { $set: { isAvailable: req.body.isAvailable } },
  );
  res.json(resData);
}

async function destroy(req, res) {
  const sId = req.params.sId;
  const resData = await db.services.deleteOne({ _id: new ObjectId(sId) });
  res.json(resData);
}

export default {
  list,
  listFeatured,
  listTechnician,
  create,
  get,
  update,
  destroy,
  updateAvailability,
};
