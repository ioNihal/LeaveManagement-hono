import { Hono } from 'hono'
import employeeRoutes from './routes/employee.routes'
import { logger } from 'hono/logger'

const app = new Hono()

app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/employee", employeeRoutes)

export default app
