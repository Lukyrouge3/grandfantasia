// See https://kit.svelte.dev/docs/types#app

import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Session } from "@supabase/gotrue-js";
import type { Database } from "$lib/supabase";

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>
		}
		interface PageData {
			session: Session | null
			user: User | null
		}
		// interface Error {}
		// interface Platform {}
	}
}