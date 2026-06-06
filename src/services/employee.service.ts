import { eq } from "drizzle-orm";
import { db } from "../db";
import { employeeTable } from "../db/schema";
import { EmployeeCreateType } from "../schema/validator";

export const employeeService = {

    async getAll() {
        const employees = await db.select()
            .from(employeeTable)

        return employees;
    },

    async create(data: EmployeeCreateType) {
        const [employee] = await db
            .insert(employeeTable)
            .values(data)
            .returning()

        console.log(employee)

        return employee;
    },

    async findExistingEmployee(email: string) {
        const result = await db
            .select()
            .from(employeeTable)
            .where(eq(employeeTable.email, email))
            .limit(1);

        return result[0] ?? null;
    }
}