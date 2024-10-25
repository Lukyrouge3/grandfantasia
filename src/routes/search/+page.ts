import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url, parent }) => {
	const { supabase } = await parent();

	const name = url.searchParams.get("q");
	const types = url.searchParams.get("types");
	const lang = "fr"; // TODO: get from user settings

	const query = supabase.from("item").select("*, item_name:translation!name_translation_id!inner(fr)").limit(10);
	if (name) query.textSearch(`item_name.${lang}`, name.trim().split(" ").map((word) => `'${word.replaceAll("'", "\\'")}':*`).join(" & "));
	if (types) query.in("item_type", types.split(",").map(Number));

	const { data: items, error } = await query;
	if (error) throw error;

	return { items };
}