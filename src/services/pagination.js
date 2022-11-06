const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 100;

function getPagination(query, totalDocs) {
  const page = query.page && query.page > 0 ? Number(query.page) : DEFAULT_PAGE_NUMBER;
  const pageSize =
    query.pageSize && query.pageSize > 0 && query.pageSize <= 100 ? Number(query.pageSize) : DEFAULT_PAGE_SIZE;
  const pageOffset = (page - 1) * pageSize;

  const totalPages =
    totalDocs % pageSize === 0 ? Math.trunc(totalDocs / pageSize) : Math.trunc(totalDocs / pageSize) + 1;

  const hasPreviousPage = page === 1 || page > totalPages + 1 ? false : true;
  const hasNextPage = page === totalPages || page > totalPages ? false : true;

  const previousPage = page === 1 || page > totalPages + 1 ? null : page - 1;
  const nextPage = page === totalPages || page > totalPages ? null : page + 1;

  return {
    page,
    pageSize,
    pageOffset,
    totalPages,
    previousPage,
    hasPreviousPage,
    nextPage,
    hasNextPage,
  };
}

module.exports = { getPagination };
