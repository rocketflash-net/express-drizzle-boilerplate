import { and, count, desc, eq, like, or, SQL } from "drizzle-orm";
import Repository from "@base/repository.base";
import { users } from "@models/user.model";
import Search from "@interfaces/repository/search.interface";
import Store from "@interfaces/repository/store.interface";
import Update from "@interfaces/repository/update.interface";
import Destroy from "@interfaces/repository/destroy.interface";
import { DatabaseExecutorType } from "@@types/database.type";
import { PaginationOptionsType } from "@@types/pagination.type";
import { NewUserType, UpdateUserType, UserFilterType, UserType } from "@@types/user.type";

export default class UserRepository
  extends Repository
  implements Search<UserType, UserFilterType>, Store<NewUserType, UserType>, Update<UpdateUserType>, Destroy
{
  // Gunakan di dalam transaction: `userRepository.withTransaction(tx).store(...)`
  withTransaction(executor: DatabaseExecutorType): UserRepository {
    return new UserRepository(executor);
  }

  async findAll(filter: UserFilterType, pagination?: PaginationOptionsType): Promise<UserType[]> {
    const query = this.executor.select().from(users).where(this.buildWhere(filter)).orderBy(desc(users.id)).$dynamic();
    if (pagination) query.limit(pagination.limit).offset(pagination.offset);
    return await query;
  }

  async count(filter: UserFilterType): Promise<number> {
    const [result] = await this.executor.select({ total: count() }).from(users).where(this.buildWhere(filter));
    return result?.total ?? 0;
  }

  async findById(id: number): Promise<UserType | null> {
    const [user] = await this.executor.select().from(users).where(eq(users.id, id)).limit(1);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<UserType | null> {
    const [user] = await this.executor.select().from(users).where(eq(users.email, email)).limit(1);
    return user ?? null;
  }

  async store(payload: NewUserType): Promise<UserType> {
    // MySQL tidak mendukung RETURNING, jadi ambil id lalu query ulang datanya.
    const [{ id }] = await this.executor.insert(users).values(payload).$returningId();
    return (await this.findById(id)) as UserType;
  }

  async update(id: number, payload: UpdateUserType): Promise<number> {
    const [result] = await this.executor.update(users).set(payload).where(eq(users.id, id));
    return result.affectedRows;
  }

  async destroy(id: number): Promise<number> {
    const [result] = await this.executor.delete(users).where(eq(users.id, id));
    return result.affectedRows;
  }

  private buildWhere(filter: UserFilterType): SQL | undefined {
    const conditions: (SQL | undefined)[] = [];
    if (filter.search) {
      const keyword = `%${filter.search}%`;
      conditions.push(or(like(users.name, keyword), like(users.email, keyword)));
    }
    return and(...conditions);
  }
}
