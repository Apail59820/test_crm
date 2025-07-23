import { useQuery } from "@tanstack/react-query";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import type { DirectusUser } from "../../models/types";

const ADMIN_ROLE = process.env.NEXT_PUBLIC_ADMIN_ROLE_ID;

async function fetchUsers(search: string) {
  return directus.request<Pick<DirectusUser, "id" | "first_name" | "last_name" | "email">[]>(
    readItems("directus_users", {
      fields: ["id", "first_name", "last_name", "email"],
      filter: {
        role: { _neq: ADMIN_ROLE },
        ...(search
          ? {
              _or: [
                { first_name: { _icontains: search } },
                { last_name: { _icontains: search } },
                { email: { _icontains: search } },
              ],
            }
          : {}),
      },
      sort: ["last_name", "first_name"],
      limit: 10,
    }),
  );
}

export function useUsers(search: string) {
  return useQuery({
    queryKey: ["users", search],
    queryFn: () => fetchUsers(search),
    enabled: Boolean(search),
  });
}
