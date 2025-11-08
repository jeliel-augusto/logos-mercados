# Role-Based Access Control (RBAC)

This API now supports role-based access control with three system roles:

## System Roles

- **CLIENT**: Default role for regular users
- **ADMIN**: Administrative users with elevated privileges
- **SUPER_ADMIN**: Super administrators with full system access

## Usage

### 1. Using the Roles Decorator

The `@Roles()` decorator can be applied to controller methods to specify which roles are allowed to access that endpoint.

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator';
import { SystemRole } from './entities/roles.enum';

@Controller('example')
export class ExampleController {
  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.ADMIN, SystemRole.SUPER_ADMIN)
  adminOnlyEndpoint() {
    return 'Admin access granted';
  }

  @Get('super-admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.SUPER_ADMIN)
  superAdminOnlyEndpoint() {
    return 'Super Admin access granted';
  }

  @Get('all-users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(SystemRole.CLIENT, SystemRole.ADMIN, SystemRole.SUPER_ADMIN)
  allUsersEndpoint() {
    return 'Access granted to all authenticated users';
  }
}
```

### 2. Guard Order

Always use guards in this order:
1. `JwtAuthGuard` - Validates the JWT token
2. `RolesGuard` - Checks if the user has the required role

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
```

### 3. JWT Payload

The JWT token now includes the user's system role:

```typescript
interface JwtPayload {
  sub: string;
  login: string;
  name: string;
  client_id?: string;
  system_role: SystemRole;
  iat?: number;
  exp?: number;
}
```

### 4. Authentication Response

The login response now includes the user's system role:

```typescript
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "login": "username",
    "name": "User Name",
    "client_id": "client_id_or_null",
    "system_role": "CLIENT"
  }
}
```

## Database Migration

The `system_role` column has been added to the `users` table with the following properties:
- Type: VARCHAR with check constraint
- Default value: 'CLIENT'
- Allowed values: 'CLIENT', 'ADMIN', 'SUPER_ADMIN'

## Example Endpoints

The following example endpoints have been added to demonstrate role-based access:

- `GET /admin` - Requires ADMIN or SUPER_ADMIN role
- `GET /super-admin` - Requires SUPER_ADMIN role only
- `GET /client` - Requires any authenticated role (CLIENT, ADMIN, or SUPER_ADMIN)

## Error Handling

If a user tries to access an endpoint without the required role, they will receive a 403 Forbidden response.

If a user tries to access a protected endpoint without a valid JWT token, they will receive a 401 Unauthorized response.
