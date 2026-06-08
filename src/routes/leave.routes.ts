import { Hono } from "hono"
import { leaveServices } from "../services/leave.service"
import { validate } from "../middlewares/validate"
import { idParamSchema, LeaveRequestCreateSchema } from "../schema/validator"
import { authMiddleware, VariablesType } from "../middlewares/auth"


const leaveRoutes = new Hono<{ Variables: VariablesType }>()

leaveRoutes.post("/", authMiddleware, validate("json", LeaveRequestCreateSchema), async (c) => {
    const body = c.req.valid("json")
    const user = c.get("user")
    const leave = await leaveServices.create(body, user.userId)
    return c.json(leave, 201)
})

leaveRoutes.patch("/:id/approve", authMiddleware, validate("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user")

    const leave = await leaveServices.findLeaveByID(id)

    if (!leave) {
        return c.json({ message: "Leave request not found!" }, 404)
    }

    const updatedLeave = await leaveServices.approve(id, user.userId)

    return c.json({ message: updatedLeave.logMessage, leave: updatedLeave.leave })
})

leaveRoutes.patch("/:id/reject", authMiddleware, validate("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user")

    const leave = await leaveServices.findLeaveByID(id)

    if (!leave) {
        return c.json({ message: "Leave request not found!" }, 404)
    }

    const updatedLeave = await leaveServices.reject(id, user.userId)

    return c.json({ message: updatedLeave.logMessage, leave: updatedLeave.leave })
})

leaveRoutes.patch("/:id/cancel", authMiddleware, validate("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const user = c.get("user")

    const leave = await leaveServices.findLeaveByID(id)

    if (!leave) {
        return c.json({ message: "Leave request not found!" }, 404)
    }

    const updatedLeave = await leaveServices.cancel(id, user.userId)

    return c.json({ message: updatedLeave.logMessage, leave: updatedLeave.leave })
})


export default leaveRoutes
