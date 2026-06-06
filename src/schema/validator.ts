import * as z from "zod"

export const EmployeeCreateSchema = z.object({
    name: z.string().min(3, "Must be at least 3 characters").max(255),
    email: z.email("Invalid email address!"),
    role: z.enum(["employee", "manager"]).default("employee"),
    annualLeaveBalance: z.number().int().min(0).default(20),
})

export type EmployeeCreateType = z.infer<typeof EmployeeCreateSchema>

export const LeaveRequestCreateSchema = z.object({
    employeeId: z.uuid(),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    reason: z.string().min(5, "Must be atleast 5 characters").max(500)
}).refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End data must be after start date!",
    path: ["endDate"]
})

export type LeaveRequestCreateType = z.infer<typeof LeaveRequestCreateSchema>