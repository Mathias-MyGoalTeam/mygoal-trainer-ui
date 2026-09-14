// Stub permission check for future role-based access control (RBAC).
//
// Mocked Mode has no real authentication/authorization yet, so this always
// grants access - but it's the single place a real check will plug into
// later (e.g. reading the logged-in trainer's roles from a session store
// and comparing against the route's required permission), so callers
// (PermissionGuard.vue) don't need to change when that lands.
export function hasPermission(_requiredPermission?: string): boolean {
  return true
}
