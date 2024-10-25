import type { createBrowserClient } from "@supabase/ssr";
import type { Database } from "$lib/supabase";

export type TextIndex = {
	id: number;
	translation: Record<string, string>;
}

export async function getText(id: number, lang: string, supabase: ReturnType<typeof createBrowserClient<Database>>) {
	const { data, error } = await supabase.from("translation").select("*").eq("id", "textIndex_" + id).single();
	if (error) {
		console.error(error);
		return;
	}
	return data;
}

export async function getTexts(ids: string[], lang: string, supabase: ReturnType<typeof createBrowserClient<Database>>) {
	const { data, error } = await supabase.from("translation").select("*").in("id", ids.map((id) => "textIndex_" + id));
	if (error) {
		console.error(error);
		return [];
	}
	if (!data) return [];
	return data;
}