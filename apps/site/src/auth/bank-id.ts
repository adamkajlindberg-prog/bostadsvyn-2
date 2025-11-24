import { betterFetch } from "@better-fetch/fetch";
import type { GenericOAuthConfig } from "better-auth/plugins";
import { env } from "@/env";

/**
 * BankID SE (Swedish BankID) authentication response data
 */
export type BankIdSEUser = {
  /** Overall eID used to authenticate */
  identityscheme: string;
  /** Legacy format of 'sub' */
  nameidentifier: string;
  /** Persistent pseudonym. Uniquely identifies an eID user (per Idura Verify tenant) */
  sub: string;
  /** Social security number */
  ssn: string;
  /** Full name */
  name: string;
  /** An OpenID Connect standard claim */
  given_name: string;
  /** An OpenID Connect standard claim */
  family_name: string;
  /** IP address */
  ipaddress: string;
  /** Country code */
  country: string;
};

export const bankIdOauthConfig: GenericOAuthConfig = {
  providerId: "idura",
  clientId: env.IDURA_CLIENT_ID,
  clientSecret: env.IDURA_CLIENT_SECRET,
  scopes: ["openid", "email", "profile"],
  discoveryUrl: `${env.IDURA_CLIENT_URL}/.well-known/openid-configuration.json`,
  pkce: true,
  getUserInfo: async ({ accessToken }) => {
    console.log("accessToken", accessToken);
    const response = await betterFetch<BankIdSEUser>(
      `${env.IDURA_CLIENT_URL}/oauth2/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    console.log("response", response);
    if (response.error) {
      throw new Error(response.error.message);
    }
    const bankIdUser = response.data;
    return {
      id: bankIdUser.sub,
      email: `${bankIdUser.nameidentifier}@bankid-bostadsvyn.se`,
      name: bankIdUser.name,
      emailVerified: false,
      image: undefined,
    };
  },
};
