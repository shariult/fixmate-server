function userLookup() {
  return [
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
  ];
}

export { userLookup };
