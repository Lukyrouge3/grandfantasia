import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase } = await parent();

	const id = params.id;

	const { data: item, error: item_error } = await supabase.from("item")
		.select(
			"*, item_tip:translation!tip_translation_id(*), item_name: translation!name_translation_id(*), drops:drop_item(stack, ...drop_item_data!inner(rand_times, monster!inner(id,level, name:translation(*), scene_monster_respawn!inner(*, ...scene!inner(scene_id:id,name:translation(*))))))",
		).eq("id", id).single();
	if (item_error) throw item_error;

	return { item };
};
