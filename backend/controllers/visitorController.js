import EntryLog from "../models/EntryLog.js";
import { generateVisitorToken } from "../utils/generateToken.js";

/**
 * =========================
 * VISITOR ENTRY CONTROLLER
 * =========================
 */
export const visitorEntry = async (req, res) => {
  try {
    let { visitorName } = req.body;

    // 🛑 Validation
    if (!visitorName || !visitorName.trim()) {
      return res.status(400).json({
        message: "Visitor name required"
      });
    }

    visitorName = visitorName.trim();

    // 🔐 Generate UNIQUE token (collision-safe)
    let token;
    let exists = true;

    while (exists) {
      token = generateVisitorToken();
      exists = await EntryLog.findOne({
        visitorToken: token,
        status: "inside"
      });
    }

    // 📝 Create entry
    const entry = new EntryLog({
      personType: "visitor",
      visitorName,
      visitorToken: token
    });

    await entry.save();

    // 🕒 Readable entry time
    const formattedEntryTime = entry.entryTime.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    res.status(201).json({
      message: "Visitor entry logged successfully",
      visitorName,
      token,
      entryTime: formattedEntryTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ========================
 * VISITOR EXIT CONTROLLER
 * ========================
 */
export const visitorExit = async (req, res) => {
  try {
    const { token } = req.body;

    // 🛑 Validation
    if (!token) {
      return res.status(400).json({
        message: "Token required"
      });
    }

    // 🔍 Find active visitor
    const entry = await EntryLog.findOne({
      visitorToken: token,
      status: "inside"
    });

    if (!entry) {
      return res.status(404).json({
        message: "Invalid token or visitor already exited"
      });
    }

    // ⏱ Exit update
    entry.exitTime = new Date();
    entry.status = "exited";
    entry.visitorToken = null; // ❌ Invalidate token

    await entry.save();

    // 🕒 Readable exit time
    const formattedExitTime = entry.exitTime.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

    res.json({
      message: "Visitor exit logged successfully",
      visitorName: entry.visitorName,
      exitTime: formattedExitTime
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
