import {
	PUBLIC_SUPABASE_ANON_KEY,
	PUBLIC_SUPABASE_URL,
} from "$env/static/public";
import { loadItems, storeItems } from "$lib/gf/item";
import type { Handle } from "@sveltejs/kit";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "$lib/supabase";
// import { loadTexts } from "$lib/gf/texts";

if (process.env.NODE_ENV !== "development") {
	console.log("Loading items...");
	console.time("Items loaded");
	const items = loadItems("C_Item.ini", "T_Item.ini");
	storeItems(items).then(() => {
		console.timeEnd("Items loaded");
	});

	console.time("Mall Items loaded");
	const mall_items = loadItems("C_ItemMall.ini", "T_ItemMall.ini");
	storeItems(mall_items).then(() => {
		console.timeEnd("Mall Items loaded");
	});

	// console.time("Texts loaded");
	// const texts = loadTexts("T_TextIndex.ini");
	// storeTexts(Array.from(texts.values())).then(() => {
	// 	console.timeEnd("Texts loaded");
	// });
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => event.cookies.getAll(),
				/**
				 * SvelteKit's cookies API requires `path` to be explicitly set in
				 * the cookie options. Setting `path` to `/` replicates previous/
				 * standard behavior.
				 */
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						event.cookies.set(name, value, {
							...options,
							path: "/",
						});
					});
				},
			},
		},
	);

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error,
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === "content-range" ||
				name === "x-supabase-api-version";
		},
	});
};
