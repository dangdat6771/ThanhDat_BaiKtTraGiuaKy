require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/studentdb';
const APP_NAME = process.env.APP_NAME || 'Student Profile App';

app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const connectDB = async () => {
  let retries = 10;
  while (retries) {
    try {
      await mongoose.connect(DB_URL);
      console.log(`✅ MongoDB connected — ${DB_URL}`);
      return;
    } catch (err) {
      console.log(`⏳ DB not ready, retrying... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.error('❌ Could not connect to MongoDB');
  process.exit(1);
};

// ─── Mongoose Schema ──────────────────────────────────────────────────────────
const studentSchema = new mongoose.Schema({
  fullName:  { type: String, required: true, trim: true },
  studentId: { type: String, required: true, unique: true, trim: true },
  className: { type: String, required: true, trim: true },
  major:     { type: String, default: 'Công nghệ thông tin' },
  email:     { type: String, trim: true },
  bio:       { type: String, default: '' },
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);

const noteSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  content: { type: String, required: true },
  tag:     { type: String, default: 'general' },
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: APP_NAME,
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// GET /about — student profile
app.get('/about', async (req, res) => {
  try {
    const student = await Student.findOne().sort({ createdAt: 1 });
    if (!student) {
      return res.status(404).json({ message: 'No profile found. Please create one.' });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /about — create or update profile
app.post('/about', async (req, res) => {
  try {
    const { fullName, studentId, className, major, email, bio } = req.body;
    if (!fullName || !studentId || !className) {
      return res.status(400).json({ message: 'fullName, studentId và className là bắt buộc.' });
    }

    const existing = await Student.findOne({ studentId });
    if (existing) {
      Object.assign(existing, { fullName, className, major, email, bio });
      await existing.save();
      return res.json({ message: 'Cập nhật thành công!', student: existing });
    }

    const student = new Student({ fullName, studentId, className, major, email, bio });
    await student.save();
    res.status(201).json({ message: 'Tạo hồ sơ thành công!', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /about/:id — update by id
app.put('/about/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Cập nhật thành công!', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /notes
app.post('/notes', async (req, res) => {
  try {
    const { title, content, tag } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'title và content là bắt buộc.' });
    }
    const note = new Note({ title, content, tag });
    await note.save();
    res.status(201).json({ message: 'Đã thêm ghi chú!', note });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /notes/:id
app.delete('/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa ghi chú.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 ${APP_NAME} running on port ${PORT}`);
  });
});
