import { Hono } from "hono";
import { validate } from "../middlewares/validate";
import { SignInSchema } from "../schema/validator";
import { employeeService } from "../services/employee.service";
import jwt from "jsonwebtoken"

export const JWT_SECRET = "very-top-secret-for-jwt";

export type UserPayloadFromJWT = {
    userId: string;
    userName: string;
    userEmail: string;
}

const authRoutes = new Hono();

authRoutes.post("/", validate("json", SignInSchema), async (c) => {
    const body = c.req.valid("json");

    const employee = await employeeService.findExistingEmployee(body.email)

    if (!employee) {
        return c.json("Employee profile not found", 404);
    }

    const token = jwt.sign({
        userId: employee.id,
        userName: employee.name,
        userEmail: employee.email
    }, JWT_SECRET, { expiresIn: "2m" })


    return c.json({
        username: employee.name,
        email: employee.email,
        token
    })
})

export default authRoutes