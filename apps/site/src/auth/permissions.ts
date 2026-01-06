import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  basic: ["all"],
  organization: ["create", "update", "delete", "invite", "manage_members"],
  property: ["create", "update", "delete", "publish"],
} as const;

export const ac = createAccessControl(statement);

// Global roles (system-wide)
export const roles = {
  admin: ac.newRole({
    basic: ["all"],
    ...adminAc.statements,
  }),
  moderator: ac.newRole({
    basic: ["all"],
  }),
  buyer: ac.newRole({
    basic: ["all"],
  }),
  seller: ac.newRole({
    basic: ["all"],
  }),
  broker: ac.newRole({
    basic: ["all"],
  }),
  company: ac.newRole({
    basic: ["all"],
  }),
};

// Organization roles (scoped to organizations)
export const organizationRoles = {
  owner: ac.newRole({
    organization: ["create", "update", "delete", "invite", "manage_members"],
    property: ["create", "update", "delete", "publish"],
  }),
  admin: ac.newRole({
    organization: ["update", "invite", "manage_members"],
    property: ["create", "update", "delete", "publish"],
  }),
  broker: ac.newRole({
    property: ["create", "update", "delete", "publish"],
  }),
  member: ac.newRole({
    // Limited read access, no write permissions
  }),
} as const;

export type OrganizationRole = keyof typeof organizationRoles;
