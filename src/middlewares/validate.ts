
import { zValidator } from "@hono/zod-validator";
import { ZodType } from "zod";


type ValidationTarget = "param" | "json" | "query" | "form" | "header";

export const validate = <T extends ZodType>(target: ValidationTarget, schema: T) =>
    zValidator(target, schema, (result, c) => {
        if (!result.success) {
            return c.json({
                message: result?.error?.issues[0]?.message || "Something went wrong!"
            }, 400);
        }
    });