import type { createBrowserClient } from "@supabase/ssr";
import type { Database } from "$lib/supabase";

export type TextIndex = {
	id: number;
	translation: Record<string, string>;
}

// export function loadTexts(path: string) {
// 	const texts = new Map<number, TextIndex>();
// 	const langs = fs.readdirSync("resources/translations");
// 	for (const lang of langs) {
// 		const lines = gfParse(
// 			"resources/translations/" + lang + "/" + path,
// 		);
// 		lines.shift();
// 		for (const l in lines) {
// 			const line = lines[l];
// 			const id = parseInt(line[0]);
// 			// console.log(id);
// 			if (!id || isNaN(id)) continue;
// 			if (!texts.has(id)) {
// 				texts.set(id, { id, translation: {} });
// 			}
// 			texts.get(id)!.translation[lang] = line[1];
// 		}
// 	}
// 	return texts;
// }

// export async function storeTexts(texts: TextIndex[]): Promise<void> {
// 	const supabase = createClient(
// 		PUBLIC_SUPABASE_URL,
// 		PRIVATE_SUPABASE_SERVICE_KEY,
// 	);
// 	const translation_chunk = texts.map((t) => {
// 		const { translation, ...other } = t;
// 		return { ...other, ...translation };
// 	});
// 	const { error: errorTranslation, data: db_translation } = await supabase.from(
// 		"text_translation",
// 	).upsert(translation_chunk).select();
// 	if (errorTranslation) {
// 		console.error(errorTranslation);
// 		return;
// 	}
// }

export async function getText(id: number, lang: string, supabase: ReturnType<typeof createBrowserClient<Database>>) {
	const { data, error } = await supabase.from("text_translation").select("*").eq("id", id).single();
	if (error) {
		console.error(error);
		return;
	}
	return data;
}

export async function getTexts(ids: number[], lang: string, supabase: ReturnType<typeof createBrowserClient<Database>>) {
	const { data, error } = await supabase.from("text_translation").select("*").in("id", ids);
	if (error) {
		console.error(error);
		return [];
	}
	if (!data) return [];
	return data;
}