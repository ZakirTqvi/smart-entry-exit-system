// backend/models/EntryLog.js
import mongoose from 'mongoose';

const entryLogSchema = new mongoose.Schema(
  {
    personType: {
      type: String,
      enum: ['student', 'teaching', 'non-teaching', 'visitor'],
      required: true
    },

    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },

    visitorName: {
      type: String,
      default: null
    },

  // 🆕 Visitor token
  visitorToken: {
    type: String,
    unique: true,
    sparse: true
  },

    entryTime: {
      type: Date,
      default: Date.now
    },

    exitTime: {
      type: Date,
      default: null
    },

      status: {
      type: String,
      enum: ['inside', 'exited'],
      default: 'inside'
    }
  },
  {
    timestamps: true
  }
);

const EntryLog = mongoose.model('EntryLog', entryLogSchema);

export default EntryLog;
