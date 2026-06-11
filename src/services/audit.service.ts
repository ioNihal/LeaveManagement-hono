import { eq, ExtractTablesWithRelations } from "drizzle-orm";
import { Database, db } from "../db";
import { auditLogTable, employeeTable, leaveRequestTable } from "../db/schema";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { PgTransaction } from "drizzle-orm/pg-core";


export type AuditLogType = {
    leaveRequestId: string;
    performedBy: string;
    action: string;
}

type TxType = Database | PgTransaction<PostgresJsQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>

export const auditServices = {
    async log(data: AuditLogType, tx?: TxType) {
        const executor = tx ?? db;
        const [log] = await executor
            .insert(auditLogTable)
            .values(data)
            .returning();

        return log
    },

    async getAll() {
        const logs = await db
            .select()
            .from(auditLogTable)
            .innerJoin(leaveRequestTable, eq(auditLogTable.leaveRequestId, leaveRequestTable.id))
            .innerJoin(employeeTable, eq(auditLogTable.performedBy, employeeTable.id))

        return logs
    }
}