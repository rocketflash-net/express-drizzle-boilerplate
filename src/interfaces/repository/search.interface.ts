import { PaginationOptionsType } from "@@types/pagination.type";

export default interface SearchInterface<TEntity, TFilter = object, TId = number> {
  findAll(filter: TFilter, pagination?: PaginationOptionsType): Promise<TEntity[]>;
  findById(id: TId): Promise<TEntity | null>;
  count(filter: TFilter): Promise<number>;
}
