import { sql } from "drizzle-orm";
import { users } from "@models/user.model";
import { DatabaseExecutorType } from "@@types/database.type";
import { NewUserType } from "@@types/user.type";

const data: NewUserType[] = [
  { name: "Administrator", email: "admin@example.com", phone: "081234567890" },
  { name: "John Doe", email: "john@example.com", phone: null },
];

export default {
  name: "user.seeder",
  // Idempotent: aman dijalankan berulang kali (upsert berdasarkan unique email).
  run: async (executor: DatabaseExecutorType): Promise<void> => {
    await executor
      .insert(users)
      .values(data)
      .onDuplicateKeyUpdate({ set: { name: sql`values(${users.name})`, phone: sql`values(${users.phone})` } });
  },
};
