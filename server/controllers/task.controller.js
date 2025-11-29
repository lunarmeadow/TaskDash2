import Task from '../models/task.model.js'
import { getErrorMessage } from './error.controller.js'

const read = (req, res) => {
  if (!req.task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  return res.json(req.task);
};

// CREATE
const create = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.auth && req.auth._id
    }
    const task = new Task(taskData)
    await task.save()
    return res.status(201).json(task)
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) })
  }
}

// LIST
// Admin/manager sees all, employees see only their own tasks
const list = async (req, res) => {
  try {
    const filter =
      req.userRole === 'admin' || req.userRole === 'manager'
        ? {}
        : { assignedTo: req.auth._id }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'employeeId name email role')
      .populate('createdBy', 'employeeId name email role')

    return res.json(tasks)
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) })
  }
}

// PARAM middleware
const taskByID = async (req, res, next, id) => {
  try {
    const task = await Task.findById(id)
      .populate('assignedTo', 'employeeId name email role')
      .populate('createdBy', 'employeeId name email role')

    if (!task) return res.status(404).json({ error: 'Task not found' })
    req.task = task
    return next()
  } catch (err) {
    return res.status(400).json({ error: 'Could not retrieve task' })
  }
}

// UPDATE
const update = async (req, res) => {
  try {
    let task = req.task
    task = Object.assign(task, req.body)
    task.updated = Date.now()
    await task.save()
    return res.json(task)
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) })
  }
}

// DELETE
const remove = async (req, res) => {
  try {
    const task = req.task
    const deletedTask = await task.deleteOne()
    return res.json(deletedTask)
  } catch (err) {
    return res.status(400).json({ error: getErrorMessage(err) })
  }
}

export default {
  create,
  list,
  taskByID,
  read,          // 👈 add this
  update,
  remove
};