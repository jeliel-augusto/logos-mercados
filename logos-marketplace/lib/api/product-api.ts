import { baseApi } from './base-api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: string;
  client_id: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  client_id: string;
  created_at: string;
  updated_at: string;
}

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductsByClientAndCategory: builder.query<
      Product[],
      { clientId: string; categoryId: string }
    >({
      query: ({ clientId, categoryId }) => `product/client/${clientId}/category/${categoryId}`,
      providesTags: ['Product'],
    }),

    getProductsByClient: builder.query<Product[], string>({
      query: (clientId) => `product/client/${clientId}`,
      providesTags: ['Product'],
    }),

    getCategoriesByClient: builder.query<Category[], string>({
      query: (clientId) => `category/client/${clientId}`,
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetProductsByClientAndCategoryQuery,
  useGetProductsByClientQuery,
  useGetCategoriesByClientQuery,
} = productApi;
