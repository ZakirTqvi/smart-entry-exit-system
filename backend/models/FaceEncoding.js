import mongoose from "mongoose"; 

const faceEncodingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    role: {
        type: String,
        enum: ['student', 'teaching', 'non-teaching'],
        required: true
    },

    encoding: {
        type: [Number],
        required: true
    }
}, {
    timestamps: true
});

const FaceEncoding = mongoose.model("FaceEncoding", faceEncodingSchema);

export default FaceEncoding;