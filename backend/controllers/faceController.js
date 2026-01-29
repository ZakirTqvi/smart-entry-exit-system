import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import FaceEncoding from '../models/FaceEncoding.js';

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller to register face encoding
export const registerFaceEncoding = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // 🔥 ABSOLUTE PATH to python file
    const pythonScriptPath = path.join(
      __dirname,
      '..', '..',           // controllers -> backend -> root
      'ai_services',
      'register_face.py'
    );

    const python = spawn('python', [pythonScriptPath, userId]);

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error('Python error:', data.toString());
    });

    python.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({
          message: 'Face capture failed',
          error: errorOutput
        });
      }

      let parsed;
      try {
        parsed = JSON.parse(output);
      } catch (err) {
        return res.status(500).json({
          message: 'Invalid data from face service',
          rawOutput: output
        });
      }

      const face = new FaceEncoding({
        userId,
        role,
        encoding: parsed.encoding
      });

      await face.save();

      res.json({
        message: 'Face encoding stored successfully'
      });
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to recognize face
export const recognizeFace = async (req, res) => {
  try {
    // 1️⃣ Load all encodings from DB
    const encodings = await FaceEncoding.find().select('userId encoding');

    if (encodings.length === 0) {
      return res.status(400).json({ message: 'No faces registered' });
    }

    // 2️⃣ Python script absolute path
    const scriptPath = path.join(
      __dirname,
      '..', '..',
      'ai_services',
      'recognize_face.py'
    );

    // ⚠️ Python path (env-safe)
    const pythonPath = process.env.PYTHON_PATH || 'python';

    const python = spawn(pythonPath, [scriptPath]);

    // 3️⃣ Send encodings to Python via stdin
    python.stdin.write(JSON.stringify(encodings));
    python.stdin.end();

    let output = '';
    let errorOutput = '';

    python.stdout.on('data', data => {
      output += data.toString();
    });

    python.stderr.on('data', data => {
      errorOutput += data.toString();
      console.error('Python:', data.toString());
    });

    python.on('close', () => {
      try {
        const result = JSON.parse(output);

        if (!result.matched) {
          return res.json({
            matched: false,
            message: 'Face not recognized (stranger)'
          });
        }

        return res.json({
          matched: true,
          userId: result.userId
        });

      } catch (err) {
        return res.status(500).json({
          message: 'Invalid response from face service',
          error: errorOutput
        });
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};