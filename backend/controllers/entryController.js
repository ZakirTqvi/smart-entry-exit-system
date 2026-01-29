
// Controller for entry and exit logging
import EntryLog from "../models/EntryLog.js";
import User from "../models/User.js";

// Controller to log entry
export const logEntry = async (req, res) => {
  try {
    const { personType, personId, visitorName } = req.body; // Destructure visitorName from request body
    const newEntry = new EntryLog({
      personType,
      personId,
      visitorName,
    });
    await newEntry.save();
    res.status(201).json({
      message: "Entry logged successfully",
      entry: newEntry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to log exit
export const logExit = async (req, res) => {
  try {
    const entry = await EntryLog.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry log not found" });
    }
    entry.exitTime = Date.now();
    entry.status = "exited";
    await entry.save();
    res.json({
      message: "Exit logged successfully",
      entry: entry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Auto decide Entry or Exit after face recognition
 * @route   POST /api/entry/auto
 * @access  Guard / Admin
 */

export const autoEntryExit = async (req, res) => {
  try {
    const { userId } = req.body;

    // 1️⃣ Check user exists & active
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(403).json({
        message: 'User not allowed or inactive'
      });
    }

    // 2️⃣ Check if user already inside
    const activeEntry = await EntryLog.findOne({
      personId: userId,
      status: 'inside'
    });

    // 🟢 CASE A: No active entry → ENTRY
    if (!activeEntry) {
      const newEntry = new EntryLog({
        personType: user.role,
        personId: userId
      });

      await newEntry.save();

      return res.status(201).json({
        action: 'entry',
        message: 'Entry logged successfully',
        entry: newEntry
      });
    }

    // 🔴 CASE B: Active entry exists → EXIT
    activeEntry.exitTime = Date.now();
    activeEntry.status = 'exited';
    await activeEntry.save();

    return res.json({
      action: 'exit',
      message: 'Exit logged successfully',
      entry: activeEntry
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
