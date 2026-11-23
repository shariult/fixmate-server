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

function technicianLookup() {
  return [
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
  ];
}

function customerLookup() {
  return [
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
  ];
}

function serviceLookup() {
  return [
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
  ];
}

function bookingLookup() {
  return [
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "bookingDetails",
      },
    },
    {
      $unwind: {
        path: "$bookingDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
}

export {
  userLookup,
  technicianLookup,
  customerLookup,
  serviceLookup,
  bookingLookup,
};
