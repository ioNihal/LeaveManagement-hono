import { Hono } from "hono";
import { authMiddleware } from "../middlewares/auth";
import { auditServices } from "../services/audit.service";

const auditRoutes = new Hono()

auditRoutes.get("/", authMiddleware, async (c) => {
    const logs = await auditServices.getAll()

    if (logs.length === 0) {
        return c.json({ message: "Audit log is empty" })
    }

    return c.json(logs)
})

export default auditRoutes