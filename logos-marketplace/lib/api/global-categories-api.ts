import { baseApi } from './base-api';

export interface GlobalCategory {
  id: string;
  name: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const globalCategoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalCategories: builder.query<GlobalCategory[], void>({
      query: () => 'global-categories',
      providesTags: ['GlobalCategory'],
    }),
    getGlobalCategoryById: builder.query<GlobalCategory, string>({
      query: (id) => `global-categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'GlobalCategory', id }],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetGlobalCategoriesQuery, useGetGlobalCategoryByIdQuery } = globalCategoriesApi;
