# RTK Query API Setup

This directory contains the RTK Query API configuration for the mobile app using the injection pattern.

## Structure

- `base-api.ts` - Base API configuration with common settings
- `global-categories-api.ts` - Injected endpoints for global categories
- `../store.ts` - Redux store configuration
- `../hooks.ts` - Typed Redux hooks

## Architecture

This setup uses RTK Query's **endpoint injection** pattern, which provides several benefits:

- Single API slice with shared configuration
- Automatic code splitting for endpoints
- Better organization and maintainability
- Shared caching and middleware

## Usage

### Using the API in Components

```typescript
import { useGetGlobalCategoriesQuery } from '@/lib/api/global-categories-api';

export function MyComponent() {
  const { data: categories, isLoading, error } = useGetGlobalCategoriesQuery();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading categories</Text>;

  return (
    <View>
      {categories?.map(category => (
        <Text key={category.id}>{category.name}</Text>
      ))}
    </View>
  );
}
```

### Using Typed Hooks

```typescript
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

export function MyComponent() {
  const dispatch = useAppDispatch();
  const someState = useAppSelector(state => state.someReducer);

  // Use dispatch and typed state
}
```

## Available Endpoints

- `useGetGlobalCategoriesQuery()` - Get all global categories
- `useGetGlobalCategoryByIdQuery(id)` - Get a specific global category by ID

## Adding New APIs

Using the injection pattern, create new API files that inject into the base API:

```typescript
// new-api.ts
import { baseApi } from './base-api';

export interface Item {
  id: string;
  name: string;
}

export const newApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => 'items',
      providesTags: ['Item'],
    }),
    createItem: builder.mutation<Item, Partial<Item>>({
      query: (item) => ({
        url: 'items',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Item'],
    }),
  }),
});

// Important: Export the hooks for usage
export const { useGetItemsQuery, useCreateItemMutation } = newApi;

// Important: Add tag types to base API
// Update base-api.ts tagTypes array to include 'Item'
```

### Steps to Add New API:

1. Create new API file injecting into `baseApi`
2. Export the generated hooks
3. Add new tag types to `base-api.ts`
4. Import and use hooks in components

## Base API Configuration

The `base-api.ts` contains:

- Base URL configuration
- Common headers (auth, etc.)
- Shared tag types
- Global caching settings
- Refetch behavior

This ensures all injected endpoints share the same configuration and behavior.
