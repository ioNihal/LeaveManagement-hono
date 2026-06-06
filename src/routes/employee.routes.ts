import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { EmployeeCreateSchema } from "../schema/validator";
import { employeeService } from "../services/employee.service";

const employeeRoutes = new Hono();


employeeRoutes.get("/", async (c) => {
    const employees = await employeeService.getAll()

    return c.json(employees)
})

employeeRoutes.post("/", zValidator("json", EmployeeCreateSchema), async (c) => {
    const body = c.req.valid("json")

    const existing = await employeeService.findExistingEmployee(body.email)

    if (existing) {
        return c.json({
            message: "Employe email already exists"
        }, 409)
    }

    const employee = await employeeService.create(body)

    return c.json({
        message: "Employee created",
        employee,
    }, 201)
})

export default employeeRoutes