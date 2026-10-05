import { PaginationMetaType, PaginationOptionsType, PaginationQueryType } from "@@types/pagination.type";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePagination = (query: Record<string, unknown>): PaginationQueryType => {
  const page = Math.max(Number(query.page) || DEFAULT_PAGE, 1);
  const limit = Math.min(Math.max(Number(query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  return { page, limit };
};

const toPaginationOptions = ({ page, limit }: PaginationQueryType): PaginationOptionsType => ({
  limit,
  offset: (page - 1) * limit,
});

const buildPaginationMeta = ({ page, limit }: PaginationQueryType, total: number): PaginationMetaType => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

export { parsePagination, toPaginationOptions, buildPaginationMeta, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT };
