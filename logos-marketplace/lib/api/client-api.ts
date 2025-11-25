import { baseApi } from './base-api';

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  time_to_delivery?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  theme_color_primary?: string;
}

export const clientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => 'client',
      providesTags: ['Client'],
    }),
    getClientById: builder.query<Client, string>({
      query: (id) => `client/${id}`,
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),
  }),
});

// Export hooks for usage in components
export const { useGetClientsQuery, useGetClientByIdQuery } = clientApi;
