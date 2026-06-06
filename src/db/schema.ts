import { relations } from "drizzle-orm";
import {
    pgTable,
    uuid,
    varchar,
    integer,
    pgEnum,
    timestamp,
    date,
    boolean,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
    "employee",
    "manager",
]);

export const leaveStatusEnum = pgEnum("leave_status", [
    "PENDING",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
]);


export const employeeTable = pgTable("employees", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 255 }).notNull(),

    email: varchar("email", { length: 255 })
        .notNull()
        .unique(),

    role: roleEnum("role")
        .notNull()
        .default("employee"),

    annualLeaveBalance: integer("annual_leave_balance")
        .notNull()
        .default(20),


    active: boolean("active").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const leaveRequestTable = pgTable("leave_requests", {
    id: uuid("id").defaultRandom().primaryKey(),

    employeeId: uuid("employee_id")
        .notNull()
        .references(() => employeeTable.id),

    startDate: date("start_date").notNull(),

    endDate: date("end_date").notNull(),

    reason: varchar("reason", { length: 500 }).notNull(),

    status: leaveStatusEnum("status")
        .notNull()
        .default("PENDING"),

    rejectionReason: varchar("rejection_reason", {
        length: 500,
    }),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});

export const auditLogTable = pgTable("audit_logs", {
    id: uuid("id").defaultRandom().primaryKey(),

    leaveRequestId: uuid("leave_request_id")
        .notNull()
        .references(() => leaveRequestTable.id),

    performedBy: uuid("performed_by")
        .notNull()
        .references(() => employeeTable.id),

    action: varchar("action", { length: 50 }).notNull(),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});


// relations

export const employeeRelations = relations(
    employeeTable,
    ({ many }) => ({
        leaveRequests: many(leaveRequestTable),
        auditLogs: many(auditLogTable)
    })
);

export const leaveRequestRelations = relations(leaveRequestTable, ({ one, many }) => ({
    employee: one(employeeTable, {
        fields: [leaveRequestTable.employeeId],
        references: [employeeTable.id]
    }),

    auditLogs: many(auditLogTable),
}))

export const auditLogsRelations = relations(auditLogTable, ({ one }) => ({
    leaveRequest: one(leaveRequestTable, {
        fields: [auditLogTable.leaveRequestId],
        references: [leaveRequestTable.id]
    }),

    performedByEmployee: one(employeeTable, {
        fields: [auditLogTable.performedBy],
        references: [employeeTable.id]
    })
}))