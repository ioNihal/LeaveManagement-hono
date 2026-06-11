import { Hono } from 'hono'
import employeeRoutes from './routes/employee.routes'
import { logger } from 'hono/logger'
import leaveRoutes from './routes/leave.routes'
import authRoutes from './routes/auth.routes'
import auditRoutes from './routes/audit.routes'

const app = new Hono()

app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/auth", authRoutes)
app.route("/employee", employeeRoutes)
app.route("/leave", leaveRoutes)
app.route("/audit", auditRoutes)

export default app
