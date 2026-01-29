// backend/controllers/occupancyController.js
import EntryLog from "../models/EntryLog.js";

export const getPeopleInside = async (req, res) => {
  try {
    const { role } = req.query; // optional filter

    const filter = { status: "inside" };
    if (role) {
      filter.personType = role;
    }

    const logs = await EntryLog.find(filter)
      .populate("personId", "name role rollNo employeeId")
      .sort({ entryTime: 1 });

    const people = logs.map((log, index) => {
      const record = {
        s_no: index + 1,
        role: log.personType,
        entryTime: new Date(log.entryTime).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short"
        })
      };

      if (log.personType === "visitor") {
        record.name = log.visitorName;
      } else {
        record.name = log.personId?.name;
      }

      return record;
    });

    res.json({
      role: role || "all",
      totalInside: people.length,
      people
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
