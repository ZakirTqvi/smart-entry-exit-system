// backend/controllers/reportController.js

import EntryLog from "../models/EntryLog.js";

export const getEntryLogs = async (req, res) => {
  try {
    const { type, page = 1, limit = 10, from, to } = req.query;

    let filter = {};

    // 🔹 Role filter
    if (type) {
      filter.personType = type;
    }

    // 🔹 Date range filter
    if (from || to) {
      filter.entryTime = {};
      if (from) {
        filter.entryTime.$gte = new Date(from);
      }
      if (to) {
        filter.entryTime.$lte = new Date(to);
      }
    }

    const skip = (page - 1) * limit;

    const totalRecords = await EntryLog.countDocuments(filter);

    const logs = await EntryLog.find(filter)
      .populate("personId", "name role department")
      .sort({ entryTime: -1 })
      .skip(skip)
      .limit(Number(limit));

    const report = logs.map(log => ({
      name:
        log.personType === "visitor"
          ? log.visitorName
          : log.personId?.name || "Unknown",

      personType: log.personType,
      department: log.personId?.department || null,

      entryTime: new Date(log.entryTime).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      }),

      exitTime: log.exitTime
        ? new Date(log.exitTime).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
          })
        : null,

      status: log.status
    }));

    res.json({
      page: Number(page),
      limit: Number(limit),
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
