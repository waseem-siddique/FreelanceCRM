const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  description: String,
  completed: { type: Boolean, default: false },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  startDate: Date,
  deadline: Date,
  budget: Number,
  progress: { type: Number, default: 0, min: 0, max: 100 },
  tasks: [taskSchema], // new field
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);