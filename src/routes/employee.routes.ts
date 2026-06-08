import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { EmployeeCreateSchema, EmployeeUpdateSchema, idParamSchema } from "../schema/validator";
import { employeeService } from "../services/employee.service";
import { validate } from "../middlewares/validate";

const employeeRoutes = new Hono();


employeeRoutes.get("/", async (c) => {
    const employees = await employeeService.getAll()

    return c.json(employees)
})

employeeRoutes.post("/", validate("json", EmployeeCreateSchema), async (c) => {
    const body = c.req.valid("json")

    const existing = await employeeService.findExistingEmployee(body.email)

    if (existing && existing.active) {
        return c.json({
            message: "Employe email already exists"
        }, 409)
    }

    if (existing && !existing.active) {
        const reactivatedEmployee = await employeeService.reactivate(existing.id, body)
        return c.json({ message: "Employee profile reactivated", reactivatedEmployee }, 200)
    }

    const employee = await employeeService.create(body)

    return c.json({
        message: "Employee created",
        employee,
    }, 201)
})

employeeRoutes.get("/:id", validate("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");

    const employee = await employeeService.getById(id);

    if (!employee) {
        return c.json({ message: "Employee not found" }, 404)
    }

    return c.json(employee, 200);
})

employeeRoutes.patch("/:id",
    validate("param", idParamSchema),
    validate("json", EmployeeUpdateSchema),
    async (c) => {
        const { id } = c.req.valid("param");
        const body = c.req.valid("json")

        const employee = await employeeService.getById(id);

        if (!employee) {
            return c.json({ message: "Employee not found" }, 404)
        }

        const updatedEmployee = await employeeService.update(body, id);

        return c.json({ message: "Employee updated", updatedEmployee }, 200)
    })


employeeRoutes.delete("/:id", validate("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param")

    const employee = await employeeService.getById(id)

    if (!employee) {
        return c.json({ message: "Employee not found!" }, 404)
    }

    const deletedEmployee = await employeeService.delete(id)

    return c.json({ message: "Employee deleted", deletedEmployee }, 200)
})

export default employeeRoutes