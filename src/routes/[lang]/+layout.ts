import { redirect } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ params }) => {
	if (!params.lang || !["fr", "pt", "en", "es"].includes(params.lang)) {
		redirect(307, "/en");
	}

	const lang = params.lang as "fr" | "pt" | "en" | "es";

	return { lang };
}