import { Context, MiddlewareHandler } from "hono";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../routes/auth.routes";
import type { UserPayloadFromJWT } from "../routes/auth.routes";


export type VariablesType = {
    user: UserPayloadFromJWT
}

export const authMiddleware: MiddlewareHandler<{ Variables: VariablesType }> = async (c, next) => {
    const authorization = c.req.header("Authorization");

    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return c.json({ message: "Unauthorized" }, 401)
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as UserPayloadFromJWT
        c.set("user", payload)
        await next()
    } catch (error) {
        console.error(error)
        return c.json({ message: "Invalid token" }, 401)
    }

}
