import { bigint, boolean, index, mysqlTable, varchar } from "drizzle-orm/mysql-core";
// PENTING: file model dibaca langsung oleh drizzle-kit, gunakan relative import (bukan alias @xxx).
import { timestamps } from "./common/timestamps.column";

export const users = mysqlTable(
  "users",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    email: varchar("email", { length: 191 }).notNull().unique(),
    phone: varchar("phone", { length: 30 }),
    isActive: boolean("is_active").notNull().default(true),
    ...timestamps,
  },
  (table) => [index("users_name_idx").on(table.name)]
);
