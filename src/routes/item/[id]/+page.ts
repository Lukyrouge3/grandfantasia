import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase } = await parent();

	const id = params.id;

	const { data: item, error } = await supabase.from("item").select("*, item_tip:translation!tip_translation_id(*), item_name: translation!name_translation_id(*)").eq("id", id).single();
	if (error) throw error;

	return { item };
}