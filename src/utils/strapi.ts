// Helper functions to build Strapi filter/pagination queries

export interface StrapiQueryParams {
  filters?: Record<string, any>;
  pagination?: {
    page: number;
    pageSize: number;
  };
  sort?: string[];
}

export function buildStrapiQuery(params: StrapiQueryParams): string {
  const queryParams = new URLSearchParams();

  if (params.filters) {
    // Build filter query
    Object.entries(params.filters).forEach(([key, value]) => {
      queryParams.append(`filters[${key}]`, String(value));
    });
  }

  if (params.pagination) {
    queryParams.append("pagination[page]", String(params.pagination.page));
    queryParams.append(
      "pagination[pageSize]",
      String(params.pagination.pageSize)
    );
  }

  if (params.sort) {
    params.sort.forEach((sort, index) => {
      queryParams.append(`sort[${index}]`, sort);
    });
  }

  return queryParams.toString();
}

