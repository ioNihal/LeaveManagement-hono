import { eq } from "drizzle-orm";
import { db } from "../db";
import { leaveRequestTable } from "../db/schema";
import { LeaveRequestCreateType } from "../schema/validator";
import { auditServices } from "./audit.service";

export const leaveServices = {
    async create(data: LeaveRequestCreateType, performedBy: string) {
        return await db.transaction(async (tx) => {
            const [leave] = await tx
                .insert(leaveRequestTable)
                .values(data)
                .returning()

            const log = await auditServices.log({
                leaveRequestId: leave.id,
                performedBy,
                action: "Created new Leave Request",
            })

            return { leave, logMessage: log.action }
        })
    },


    async findLeaveByID(id: string) {
        const result = await db
            .select()
            .from(leaveRequestTable)
            .where(eq(leaveRequestTable.id, id))
            .limit(1)

        return result[0] && null
    },

    async approve(id: string, performedBy: string) {
        return await db.transaction(async (tx) => {
            const [leave] = await tx
                .update(leaveRequestTable)
                .set({ status: "APPROVED", updatedAt: new Date() })
                .where(eq(leaveRequestTable.id, id))
                .returning()

            const log = await auditServices.log({
                leaveRequestId: leave.id,
                performedBy,
                action: "Approved Leave Request",
            })

            return { leave, logMessage: log.action }
        })
    },

    async reject(id: string, performedBy: string) {
        return await db.transaction(async (tx) => {
            const [leave] = await tx
                .update(leaveRequestTable)
                .set({ status: "REJECTED", updatedAt: new Date() })
                .where(eq(leaveRequestTable.id, id))
                .returning()

            const log = await auditServices.log({
                leaveRequestId: leave.id,
                performedBy,
                action: "Rejected new Leave Request",
            })

            return { leave, logMessage: log.action }
        })
    },

    async cancel(id: string, performedBy: string) {
        return await db.transaction(async (tx) => {
            const [leave] = await tx
                .update(leaveRequestTable)
                .set({ status: "CANCELLED", updatedAt: new Date() })
                .where(eq(leaveRequestTable.id, id))
                .returning()

            const log = await auditServices.log({
                leaveRequestId: leave.id,
                performedBy,
                action: "Cancelled new Leave Request",
            })

            return { leave, logMessage: log.action }
        })
    },
}