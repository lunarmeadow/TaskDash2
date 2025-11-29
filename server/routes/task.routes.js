import express from 'express'
import taskCtrl from '../controllers/task.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// Param
router.param('taskId', taskCtrl.taskByID)

// Protect all task routes
router.use(authCtrl.requireSignin, authCtrl.attachUserRole)

// List / Create
router
  .route('/')
  .get(taskCtrl.list) // behavior depends on role inside controller
  .post(authCtrl.hasRole('admin', 'manager'), taskCtrl.create)

// Read / Update / Delete single task
router
  .route('/:taskId')
    .get(authCtrl.canAccessTask, taskCtrl.read)   
  .put(authCtrl.canAccessTask, taskCtrl.update)
  .delete(authCtrl.hasRole('admin', 'manager'), taskCtrl.remove)

export default router