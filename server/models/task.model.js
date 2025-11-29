import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    trim: true,
    unique: 'Task ID must be unique',
    required: 'Task ID is required'
  },
  name: {
    type: String,
    trim: true,
    required: 'Task name is required'
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  scheduledAt: {
    type: Date,
    required: 'Task date and time is required'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee',
    required: 'Assigned employee is required'
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Employee'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
})

export default mongoose.model('Task', TaskSchema)