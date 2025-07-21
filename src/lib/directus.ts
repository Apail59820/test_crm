// lib/directus.ts
import { createDirectus, rest, authentication } from "@directus/sdk";

import type { AuthenticationData } from "@directus/sdk";
import type { ApiCollections } from "../../models/types";

const browserStorage: {
  set(data): Promise<void>;
  get(): Promise<AuthenticationData | null>;
  delete(): Promise<void>;
} = {
  async get() {
    const raw = window.localStorage.getItem("directus_auth");
    return raw ? (JSON.parse(raw) as AuthenticationData) : null;
  },
  async set(data) {
    window.localStorage.setItem("directus_auth", JSON.stringify(data));
  },
  async delete() {
    window.localStorage.removeItem("directus_auth");
  },
};
export const directus = createDirectus<ApiCollections>(
  process.env.NEXT_PUBLIC_DIRECTUS_URL!,
)
  .with(rest())
  .with(
    authentication("json", {
      autoRefresh: true,
      storage: browserStorage,
    }),
  );
