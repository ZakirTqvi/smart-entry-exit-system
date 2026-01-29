import EntryLog from "../models/EntryLog.js";

export const getMonthlyAttendance = async (req, res) => {
  try {
    const { role, month, year } = req.query;

    if (!role || !month || !year) {
      return res.status(400).json({
        message: "role, month and year are required"
      });
    }

    if (!["student", "teaching", "non-teaching"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // 📅 Month range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const logs = await EntryLog.find({
      personType: role,
      entryTime: { $gte: startDate, $lt: endDate }
    }).populate("personId", "name role rollNo employeeId");

    const attendanceMap = {};

    logs.forEach(log => {
      if (!log.personId) return;

      const userId = log.personId._id.toString();
      const dateKey = new Date(log.entryTime).toDateString();

      if (!attendanceMap[userId]) {
        attendanceMap[userId] = {
          name: log.personId.name,
          rollNo: log.personId.rollNo || null,
          employeeId: log.personId.employeeId || null,
          days: new Set()
        };
      }

      attendanceMap[userId].days.add(dateKey);
    });

    // 🎯 ROLE-BASED CLEAN RESPONSE
    const attendance = Object.values(attendanceMap).map((u, index) => {
      const record = {
        s_no: index + 1,
        name: u.name,
        daysPresent: u.days.size
      };

      if (role === "student") {
        record.rollNo = u.rollNo;
      } else {
        record.employeeId = u.employeeId;
      }

      return record;
    });

    res.json({
      role,
      month,
      year,
      totalRecords: attendance.length,
      attendance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
