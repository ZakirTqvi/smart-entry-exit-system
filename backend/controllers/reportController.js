import EntryLog from "../models/EntryLog.js";
import User from "../models/User.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";



// Summary report
export const getSummaryReport = async (req, res) => {
  try {
    const totalEntries = await EntryLog.countDocuments();
    const totalExits = await EntryLog.countDocuments({ status: "exited" });
    const visitors = await EntryLog.countDocuments({ personType: "visitor" });
    const students = await User.countDocuments({ role: "student" });

    // Average daily footfall
    const daily = await EntryLog.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$entryTime" } },
          count: { $sum: 1 }
        }
      }
    ]);

    const avgDaily =
      daily.length > 0
        ? Math.round(daily.reduce((a, b) => a + b.count, 0) / daily.length)
        : 0;

    res.json({
      totalEntries,
      totalExits,
      visitors,
      students,
      avgDaily
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Daily entries for last 7 days
export const getDailyEntries = async (req, res) => {
  try {
    const data = await EntryLog.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$entryTime" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    const result = data.map(d => ({
      date: d._id,
      count: d.count
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Role distribution of entries
export const getRoleDistribution = async (req, res) => {
  try {
    const data = await EntryLog.aggregate([
      {
        $group: {
          _id: "$personType",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = data.map(d => ({
      role: d._id,
      count: d.count
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Export entry logs as CSV
export const exportLogsCSV = async (req, res) => {
  try {
    const { role, status, from, to } = req.query;

    let filter = {};

    if (role) filter.personType = role;
    if (status && status !== "both") filter.status = status;

    if (from || to) {
      filter.entryTime = {};
      if (from) filter.entryTime.$gte = new Date(from);
      if (to) filter.entryTime.$lte = new Date(to);
    }

    const logs = await EntryLog.find(filter).populate("personId", "name");

    const data = logs.map(log => ({
      Name: log.personId?.name || log.visitorName,
      Role: log.personType,
      EntryTime: new Date(log.entryTime).toLocaleString("en-IN"),
      ExitTime: log.exitTime ? new Date(log.exitTime).toLocaleString("en-IN") : "Inside",
      Status: log.status
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_logs.csv");
    res.send(csv);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Export entry logs as PDF
export const exportLogsPDF = async (req, res) => {
  try {
    const { role, status, from, to } = req.query;

    let filter = {};

    if (role) filter.personType = role;
    if (status && status !== "both") filter.status = status;

    if (from || to) {
      filter.entryTime = {};
      if (from) filter.entryTime.$gte = new Date(from);
      if (to) filter.entryTime.$lte = new Date(to);
    }

    const logs = await EntryLog.find(filter).populate("personId", "name department");

    console.log("PDF logs count:", logs.length);

    const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=entry_logs_report.pdf"
    );

    doc.pipe(res);

    /* ================= HEADER ================= */

    doc.fontSize(20).text("Smart Entry Exit System Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Generated On: ${new Date().toLocaleString()}`);
    doc.moveDown(2);

    if (!logs.length) {
      doc.text("No records found for selected filters.");
      doc.end();
      return;
    }

    /* ================= TABLE CONFIG ================= */

    const headers = ["#", "Name", "Role", "Department", "Entry Time", "Exit Time", "Status"];

    const rows = logs.map((log, i) => [
      i + 1,
      log.personType === "visitor" ? log.visitorName : log.personId?.name || "N/A",
      log.personType,
      log.personId?.department || "N/A",
      new Date(log.entryTime).toLocaleString(),
      log.exitTime ? new Date(log.exitTime).toLocaleString() : "-",
      log.status
    ]);

    const colWidths = [30, 140, 90, 130, 180, 180, 80];
    let startX = 40;
    let startY = doc.y;

    /* ================= DRAW HEADER ROW ================= */

    doc.fontSize(10).fillColor("black").font("Helvetica-Bold");

    headers.forEach((header, i) => {
      doc.text(header, startX, startY, { width: colWidths[i] });
      startX += colWidths[i];
    });

    startY += 20;
    doc.font("Helvetica");

    /* ================= DRAW ROWS ================= */

    rows.forEach((row, rowIndex) => {
      startX = 40;

      // Zebra row background
      if (rowIndex % 2 === 0) {
        doc.rect(35, startY - 2, 520, 18).fill("#f2f2f2").fillColor("black");
      }

      row.forEach((cell, i) => {
        doc.text(String(cell), startX, startY, { width: colWidths[i] });
        startX += colWidths[i];
      });

      startY += 18;

      // New page if overflow
      if (startY > 750) {
        doc.addPage();
        startY = 50;
      }
    });

    /* ================= FOOTER ================= */

    doc.moveDown(2);
    doc.x = 40;
    doc.fontSize(10).text("Generated by Smart Entry Exit System", { align: "center", width: doc.page.width - 80 });
    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "PDF export failed" });
  }
};



