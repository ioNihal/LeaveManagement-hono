import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { employeeTable } from "../db/schema";
import { EmployeeCreateType, EmployeeUpdateType } from "../schema/validator";

export const employeeService = {

    async create(data: EmployeeCreateType) {
        const [employee] = await db
            .insert(employeeTable)
            .values(data)
            .returning()

        return employee;
    },

    async findExistingEmployee(email: string) {
        const result = await db
            .select()
            .from(employeeTable)
            .where(and(eq(employeeTable.email, email)))
            .limit(1);

        return result[0] ?? null;
    },

    async getById(id: string) {
        const result = await db
            .select()
            .from(employeeTable)
            .where(and(eq(employeeTable.id, id), eq(employeeTable.active, true)))
            .limit(1);

        return result[0] ?? null
    },

    async getAll() {
        const employees = await db
            .select()
            .from(employeeTable)
            .where(eq(employeeTable.active, true))

        return employees;
    },

    async update(data: EmployeeUpdateType, id: string) {
        const [employee] = await db
            .update(employeeTable)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(employeeTable.id, id))
            .returning()

        return employee
    },

    async delete(id: string) {
        const [employee] = await db
            .update(employeeTable)
            .set({ active: false, updatedAt: new Date() })
            .where(eq(employeeTable.id, id))
            .returning()

        return employee
    },

    async reactivate(id: string) {
        const [employee] = await db
            .update(employeeTable)
            .set({ active: true, updatedAt: new Date() })
            .where(eq(employeeTable.id, id))
            .returning()

        return employee
    }

}