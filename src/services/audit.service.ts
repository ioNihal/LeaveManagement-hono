import { db } from "../db";
import { auditLogTable } from "../db/schema";

export type AuditLogType = {
    leaveRequestId: string;
    performedBy: string;
    action: string;
}

export const auditServices = {
    async log(data: AuditLogType) {
        const [log] = await db
            .insert(auditLogTable)
            .values(data)
            .returning();

        return log
    }
}