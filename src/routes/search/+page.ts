import { getClasses, getClassesStringFromList } from "$lib/gf/class";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ url, parent }) => {
	const { supabase } = await parent();

	const name = url.searchParams.get("q");
	const types = url.searchParams.get("types");
	const types_array = (types?.split(",").map(Number) || []);
	const classes = url.searchParams.get("classes"); // TODO: implement classes
	const min_level = url.searchParams.get("min_level");
	const max_level = url.searchParams.get("max_level");
	const lang = "fr"; // TODO: get from user settings

	const query = supabase.from("item").select("*, item_name:translation!name_translation_id!inner(fr)").limit(10);
	if (name && name.length > 0) query.textSearch(`item_name.${lang}`, name.trim().split(" ").map((word) => `'${word.replaceAll("'", "\\'")}':*`).join(" & "));
	if (types && types.length > 0) query.in("item_type", types_array);
	if (min_level) query.gte("restrict_level", parseInt(min_level));
	if (max_level) query.lte("restrict_level", parseInt(max_level));
	if (classes) {
		query.eq("restrict_class", classes);
	}


	const { data: items, error } = await query;
	if (error) throw error;

	return { items, name, types: types_array, min_level, max_level, classes };
}