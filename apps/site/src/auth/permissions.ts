import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  basic: ["all"],
} as const;

export const ac = createAccessControl(statement);

// TODO, Add correct permissions for each role
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
