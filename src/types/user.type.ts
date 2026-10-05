import { users } from "@models/user.model";

// Tipe entity diturunkan langsung dari schema Drizzle, jadi selalu sinkron dengan tabel.
type UserType = typeof users.$inferSelect;

type NewUserType = typeof users.$inferInsert;

type CreateUserType = Pick<NewUserType, "name" | "email" | "phone">;

type UpdateUserType = Partial<Pick<NewUserType, "name" | "email" | "phone" | "isActive">>;

type UserFilterType = {
  search?: string;
};

export type { UserType, NewUserType, CreateUserType, UpdateUserType, UserFilterType };
