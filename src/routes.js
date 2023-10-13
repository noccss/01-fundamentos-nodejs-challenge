import { randomUUID } from 'crypto'
import { Database } from "./database.js"
import { buildRoutes } from "./utils/build-routes.js"

const database = new Database

export const routes = [
  {
    method: 'GET',
    path: buildRoutes('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutes('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.writeHead(201).end('Task_Created_with_Success')
    }
  },
  {
    method: 'DELETE',
    path: buildRoutes('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end('Task_Deleted')
    }
  },
  {
    method: 'PUT',
    path: buildRoutes('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const [task] = database.select('tasks', { id })

      if (!task) return res.writeHead(404).end('Task not Found')

      database.update('tasks', id, {
        title,
        description,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutes('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id })

      if (!task) return res.writeHead(404).end('Task not Found')

      const isCompleted = !!task.completed_at
      const completed_at = isCompleted ? null : new Date()

      database.update('tasks', id, { completed_at })

      return res.writeHead(204).end()

    }
  }
]