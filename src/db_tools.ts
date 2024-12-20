import dotenv from "dotenv";
dotenv.config();
import iconv from 'iconv-lite';

import { maxDropItem, type DropItem, type DropItemData, type Item } from "$lib/gf/item";
import { gfParse } from "$lib/gf/parser";
import type { TextIndex } from "$lib/gf/texts";
import type { Database } from "$lib/supabase";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import type { Monster } from "$lib/gf/monster";

export function loadTexts(path: string) {
	const texts = new Map<number, TextIndex>();
	const langs = fs.readdirSync("resources/translations");
	for (const lang of langs) {
		const lines = gfParse(
			"resources/translations/" + lang + "/" + path,
		);
		lines.shift();
		for (const l in lines) {
			const line = lines[l];
			const id = parseInt(line[0]);
			// console.log(id);
			if (!id || isNaN(id)) continue;
			if (!texts.has(id)) {
				texts.set(id, { id, translation: {} });
			}
			texts.get(id)!.translation[lang] = line[1];
		}
	}
	return texts;
}

export async function storeTexts(texts: TextIndex[], supabase: ReturnType<typeof createClient<Database>>): Promise<void> {
	const translation_chunk = texts.map((t) => {
		const { translation, ...other } = t;
		return { id: "textIndex_" + other.id, ...translation };
	});
	const { error: errorTranslation, data: db_translation } = await supabase.from(
		"translation",
	).upsert(translation_chunk).select();
	if (errorTranslation) {
		console.error(errorTranslation);
		return;
	}
}

export function loadItems(file: string, translationFile: string): Item[] {
	const items: Item[] = [];

	{
		const lines = gfParse("resources/" + file);
		lines.shift();
		for (const l in lines) {
			// console.log(l, lines[l]);
			const line = lines[l];
			const item = {
				id: parseInt(line[0]),
				icon_filename: line[1],
				model_id: line[2],
				model_filename: line[3],
				weapon_effect_id: parseInt(line[4]),
				fly_effect_id: parseInt(line[5]),
				used_effect_id: parseInt(line[6]),
				used_sound_name: line[7],
				enhance_effect_id: parseInt(line[8]),
				name: line[9],
				item_type: parseInt(line[10]),
				equip_type: parseInt(line[11]),
				op_flags: parseInt(line[12]),
				op_flags_plus: parseInt(line[13]),
				target: parseInt(line[14]),
				restrict_gender: parseInt(line[15]),
				restrict_level: parseInt(line[16]) || 0,
				restrict_max_level: parseInt(line[17]),
				rebirth_count: parseInt(line[18]),
				rebirth_score: parseInt(line[19]),
				rebirth_max_score: parseInt(line[20]),
				restrict_align: parseInt(line[21]),
				restrict_prestige: parseInt(line[22]),
				restrict_class: line[23],
				item_quality: line[24],
				item_group: parseInt(line[25]),
				casting_time: parseInt(line[26]),
				cooldown_time: parseInt(line[27]),
				cooldown_group: parseInt(line[28]),
				max_hp: parseInt(line[29]),
				max_mp: parseInt(line[30]),
				str: parseInt(line[31]),
				vit: parseInt(line[32]),
				int: parseInt(line[33]),
				will: parseInt(line[34]),
				agi: parseInt(line[35]),
				avg_physical_damage: parseInt(line[36]),
				rand_physical_damage: parseInt(line[37]),
				attack_range: parseInt(line[38]),
				attack_speed: parseInt(line[39]),
				attack: parseInt(line[40]),
				range_attack: parseInt(line[41]),
				physical_defence: parseInt(line[42]),
				magic_damage: parseInt(line[43]),
				magic_defence: parseInt(line[44]),
				hit_rate: parseInt(line[45]),
				dodge_rate: parseInt(line[46]),
				physical_critical_rate: parseInt(line[47]),
				physical_critical_damage: parseInt(line[48]),
				magic_critical_rate: parseInt(line[49]),
				magic_critical_damage: parseInt(line[50]),
				physical_penetration: parseInt(line[51]),
				magic_penetration: parseInt(line[52]),
				physical_penetration_defence: parseInt(line[53]),
				magic_penetration_defence: parseInt(line[54]),
				attribute: parseInt(line[55]),
				attribute_rate: parseInt(line[56]),
				attribute_damage: parseInt(line[57]),
				attribute_resist: parseInt(line[58]),
				special_type: parseInt(line[59]),
				special_rate: parseInt(line[60]),
				special_damage: parseInt(line[61]),
				drop_rate: parseInt(line[62]),
				drop_index: parseInt(line[63]),
				treasure_buffs1: parseInt(line[64]),
				treasure_buffs2: parseInt(line[65]),
				treasure_buffs3: parseInt(line[66]),
				treasure_buffs4: parseInt(line[67]),
				enchant_type: parseInt(line[68]),
				enchant_id: parseInt(line[69]),
				expert_level: parseInt(line[70]),
				expert_enchant_id: parseInt(line[71]),
				elf_skill_id: parseInt(line[72]),
				enchant_time_type: parseInt(line[73]),
				enchant_duration: parseInt(line[74]),
				limit_type: parseInt(line[75]),
				due_date_time: parseInt(line[76]),
				backpack_size: parseInt(line[77]),
				max_socket: parseInt(line[78]),
				socket_rate: parseInt(line[79]),
				max_durability: parseInt(line[80]),
				max_stack: parseInt(line[81]),
				shop_price_type: parseInt(line[82]),
				sys_price: parseInt(line[83]),
				restrict_event_pos_id: line[84],
				unknown_string: line[85],
				block_rate: parseInt(line[86]),
				log_level: parseInt(line[87]),
				auction_type: parseInt(line[88]),
				extra_data1: parseInt(line[89]),
				extra_data2: parseInt(line[90]),
				extra_data3: parseInt(line[91]),
				tip: line[92],
				name_translation: {},
				tip_translation: {},
			};
			if (!isNaN(item.id)) items.push(item);
		}
	}
	{
		const langs = fs.readdirSync("resources/translations");
		for (const lang of langs) {
			const lines = gfParse(
				"resources/translations/" + lang + "/" + translationFile,
			);
			lines.shift();
			for (const l in lines) {
				const line = lines[l];
				const id = parseInt(line[0]);
				const item = items.find((i) => i.id === id);
				if (item) {
					item.name_translation[lang] = line[1];
					item.tip_translation[lang] = line[2];
				}
			}
		}
	}
	return items;
}

export async function storeItems(items: Item[], supabase: ReturnType<typeof createClient<Database>>): Promise<void> {
	const fitlered_items = items.filter(i => Object.keys(i.name_translation).length > 0 && Object.keys(i.tip_translation).length > 0);

	for (let i = 0; i < fitlered_items.length; i += 500) {
		console.log("Storing items", i, "to", i + 500);
		const fitlered_items_chunk = fitlered_items.slice(i, i + 500);
		const item_chunk = fitlered_items_chunk.map((i) => {
			const { name_translation, tip_translation, ...other } = i;
			return {...other, name_translation_id: "item_name_" + i.id, tip_translation_id: "item_tip_" + i.id};
		});
		const name_translation_chunk = fitlered_items_chunk.map((i, idx) => {
			const { name_translation } = i;
			return { id: "item_name_" + i.id, ...name_translation };
		});
		const tip_translation_chunk = fitlered_items_chunk.map((i, idx) => {
			const { tip_translation } = i;
			return { id: "item_tip_" + i.id, ...tip_translation };
		});
		const { error: errorName, data: db_name } = await supabase.from(
			"translation",
		).upsert(name_translation_chunk, { onConflict: "id" }).select();
		if (errorName) {
			console.error(errorName);
			return;
		}
		const { error: errorTip, data: db_tip } = await supabase.from(
			"translation",
		).upsert(tip_translation_chunk, { onConflict: "id" }).select();
		if (errorTip) {
			console.error(errorTip);
			return;
		}

		const res = await fetch(process.env.PUBLIC_SUPABASE_URL + "/rest/v1/item", {
			method: "POST",
			headers: {
				"apikey": process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Authorization": "Bearer " + process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Content-Type": "application/json",
				"Prefer": "resolution=merge-duplicates"
			},
			body: JSON.stringify(item_chunk),
		});
		if (!res.ok) {
			console.error("Failed to store items", await res.text());
			return;
		}
	}
}

export function loadDropItems(file: string): DropItemData[] {
	const lines = gfParse("resources/" + file);
    lines.shift();
    const data: DropItemData[] = [];
    for (const l in lines) {
        const line = lines[l];
        const item: DropItemData = {
            monster_id: parseInt(line[0]),
            name: line[1],
            level: parseInt(line[2]) || 0,
            drop_gold_rate: parseInt(line[3]),
            avg_gold: parseInt(line[4]),
            rand_gold: parseInt(line[5]),
            rand_times: parseInt(line[6]) || 0,
            not_drop_rate: parseInt(line[7]),
            green_rate: parseInt(line[8]),
            blue_rate: parseInt(line[9]),
            orange_rate: parseInt(line[10]),
            yellow_rate: parseInt(line[11]),
            unknown1: parseFloat(line[12]),
            drop_items: [],
            unknown_string: line[14 + maxDropItem * 4]
        };
        const dropItems: DropItem[] = Array(maxDropItem);
        for (let i = 0; i < maxDropItem; i++) {
            const dropItem = {
                item_id: parseInt(line[13 + 4*i]),
                item_name: line[4*i + 14],
                stack: parseInt(line[4*i + 15]) || 0,
                rate: parseFloat(line[4*i + 16])
            };
            dropItems[i] = dropItem;
        }
        item.drop_items = dropItems;
        item.unknown_string = line[14 + maxDropItem];
        if (!isNaN(item.monster_id)) data.push(item);
    }
    return data;
}

export async function storeDropItems(dropItems: DropItemData[], supabase: ReturnType<typeof createClient<Database>>): Promise<void> {
	const items = loadItems("C_Item.ini", "T_Item.ini");
	const monsters = loadMonsters("C_Monster.ini", "T_Monster.ini");

	for (let i = 0; i < dropItems.length; i += 500) {
		console.log("Storing items", i, "to", i + 500);
		const chunk = dropItems.slice(i, i + 500);
		const drop_item_data_chunk = chunk.map((i) => {
			const { drop_items, ...other } = i;
			return {...other};
		}).filter(i => monsters.has(i.monster_id));

		const {data, error} = await supabase.from("drop_item_data").upsert(drop_item_data_chunk, { onConflict: "monster_id" }).select("id, monster_id");

		if (error || !data) {
			console.error("Failed to store drop item data", error);
			return;
		}

		const drop_item_chunk = chunk.map((i, idx) => {
			const { drop_items } = i;
			return drop_items.map(di => {
				const didi = data.find(d => d.monster_id == i.monster_id)?.id || 0;
				return { drop_item_data_id: didi, ...di };
			}).filter(di => di.item_id && di.drop_item_data_id && items.find(it => it.id === di.item_id));
		}).flat();

		const res2 = await fetch(process.env.PUBLIC_SUPABASE_URL + "/rest/v1/drop_item", {
			method: "POST",
			headers: {
				"apikey": process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Authorization": "Bearer " + process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Content-Type": "application/json",
				"Prefer": "resolution=merge-duplicates"
			},
			body: JSON.stringify(drop_item_chunk),
		});
		if (!res2.ok) {
			console.error("Failed to store items", await res2.text());
			return;
		}
	}
}

export function loadMonsters(file: string, translation: string): Map<number, Monster> {
	const monsters: Map<number, Monster> = new Map();

	{
		const lines = gfParse("resources/" + file);
		lines.shift();
		for(const line of lines) {
			const monster: Monster = {
				id: parseInt(line[0]),
				model_ids: line[1],
				name: line[2],
				level: parseInt(line[3]) || 0,
				rank: parseInt(line[4]),
				type: line[5],
				max_hp: parseInt(line[6]),
				max_mp: parseInt(line[7]),
				fear_type: parseInt(line[8]),
				part_hp: parseInt(line[9]),
				part_breaking_action: parseInt(line[10]),
				avg_physical_damage: parseInt(line[11]),
				rand_physical_damage: parseInt(line[12]),
				attack_range: parseInt(line[13]),
				attack_speed: parseInt(line[14]),
				attack: parseInt(line[15]),
				physical_defence: parseInt(line[16]),
				magic_damage: parseInt(line[17]),
				magic_defence: parseInt(line[18]),
				hit_rate: parseInt(line[19]),
				dodge_rate: parseInt(line[20]),
				physical_critical_rate: parseInt(line[21]),
				physical_critical_damage: parseInt(line[22]),
				magic_critical_rate: parseInt(line[23]),
				magic_critical_damage: parseInt(line[24]),
				physical_penetration: parseInt(line[25]),
				magical_penetration: parseInt(line[26]),
				physical_penetration_defence: parseInt(line[27]),
				magical_penetration_defence: parseInt(line[28]),
				attribute: parseInt(line[29]),
				attribute_damage: parseInt(line[30]),
				attribute_rate: parseInt(line[31]),
				attribute_resist: parseInt(line[32]),
				innate_buffs: line[33],
				rand_buff_num: parseInt(line[34]),
				random_buffs: line[35],
				casting_effect_id: parseInt(line[36]),
				roam_speed: parseInt(line[37]),
				pursuit_speed: parseInt(line[38]),
				move_range: parseInt(line[39]),
				detect_range: parseInt(line[40]),
				ai_id: parseInt(line[41]),
				max_call_help: parseInt(line[42]),
				monster_alignment: parseInt(line[43]),
				idle_spell_id: parseInt(line[44]),
				battle_spells: line[45],
				restore_spell_id: parseInt(line[46]),
				summon_monster_id: parseInt(line[47]),
				summon_type: parseInt(line[48]),
				summon_rate: parseInt(line[49]),
				summon_max: parseInt(line[50]),
				summon_effect_id: parseInt(line[51]),
				exp: parseInt(line[52]),
				shout: line[53],
				shout_for_man: line[54],
				shout_for_woman: line[55],
				zone_icon: line[56],
				locate_limit: parseInt(line[57]),
				achievement_map: line[58],
				auto_spell_during: line[59] === 'true',
				auto_spell_id: parseInt(line[60]),
				spell_shout_cmds: line[61],
				special_flag: parseInt(line[62]),
				lower_limit: parseInt(line[63]),
				name_translation: {},
				name_translation_id: "monster_name_" + line[0],
				model_scales: null
			};
			if (monster.id && !isNaN(monster.id)) monsters.set(monster.id, monster);
		}
	}

	{
		const langs = fs.readdirSync("resources/translations");
		for (const lang of langs) {
			const lines = gfParse(
				"resources/translations/" + lang + "/" + translation,
			);
			lines.shift();
			for (const l in lines) {
				const line = lines[l];
				const id = parseInt(line[0]);
				const monster = monsters.get(id);
				if (monster) {
					monster.name_translation[lang] = line[1];
				}
			}
		}
	}
	return monsters;
}

export async function storeMonsters(monsters: Map<number, Monster>, supabase: ReturnType<typeof createClient<Database>>) {
	const fitlered_monsters = Array.from(monsters.values()).filter(i => Object.keys(i.name_translation).length > 0);

	for (let i = 0; i < fitlered_monsters.length; i += 500) {
		console.log("Storing monsters", i, "to", i + 500);
		const fitlered_monsters_chunk = fitlered_monsters.slice(i, i + 500);
		const monster_chunk = fitlered_monsters_chunk.map((i) => {
			const { name_translation, ...other } = i;
			return {...other, name_translation_id: "monster_name_" + i.id};
		});
		const name_translation_chunk = fitlered_monsters_chunk.map((i, idx) => {
			const { name_translation } = i;
			return { id: "monster_name_" + i.id, ...name_translation };
		});
		const { error: errorName, data: db_name } = await supabase.from(
			"translation",
		).upsert(name_translation_chunk, { onConflict: "id" }).select();
		if (errorName) {
			console.error(errorName);
			return;
		}

		const res = await fetch(process.env.PUBLIC_SUPABASE_URL + "/rest/v1/monster", {
			method: "POST",
			headers: {
				"apikey": process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Authorization": "Bearer " + process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Content-Type": "application/json",
				"Prefer": "resolution=merge-duplicates"
			},
			body: JSON.stringify(monster_chunk),
		});
		if (!res.ok) {
			console.error("Failed to store monsters", await res.text());
			return;
		}
	}
}

export type Scene = {
	id: string;
	name_translation_id: string;
	name_translation: Record<string, string>;
	monster_respawns: {id: number, monster_id: number, patrol_id: number, max_amount: number, time_to_respawn: number, x: number, y: number}[];
}

export function loadScenes() {
	const files = fs.readdirSync("resources/scenes");
	const scenes: Map<string, Scene> = new Map();

	for (const file of files) {
		const ini = iconv.decode(fs.readFileSync("resources/scenes/" + file), 'win1252');
		// Skip to "[reborn_monsters]\r\n"
		const lines = ini.split(",\r\n");
		const scene: Scene = {
			id: file.replace(".ini", ""),
			name_translation_id: "scene_name_" + file.replace(".ini", ""),
			monster_respawns: [],
			name_translation: {fr: "", en: "", es: "", pt: ""}
		};
		let skip_line = 0;
		for (const line of lines) {
			if (line == "[reborn_monsters]") break;
			skip_line++;
		}
		for (let i = skip_line; i < lines.length; i++) {
			const line = lines[i];
			if (line == "[npc]") break;
			const parts = line.split(",");
			const monster_respawn = {
				id: parseInt(parts[0]),
				monster_id: parseInt(parts[1]),
				patrol_id: parseInt(parts[2]),
				max_amount: parseInt(parts[3]),
				time_to_respawn: parseInt(parts[4]),
				x: parseFloat(parts[5]),
				y: parseFloat(parts[6])
			};
			if (monster_respawn.id) scene.monster_respawns.push(monster_respawn);
		}
		scenes.set(scene.id, scene);
	}

	{
		const langs = fs.readdirSync("resources/translations");
		for (const lang of langs) {
			const lines = gfParse(
				"resources/translations/" + lang + "/" + "T_Node.ini",
			);
			lines.shift();
			for (const l in lines) {
				const line = lines[l];
				const id = line[0];
				const scene_id = "S" + "0".repeat(3 - id.length) + id;
				const scene = scenes.get(scene_id);
				if (scene) {
					scene.name_translation[lang] = line[1];
				}
			}
		}
	}

	return scenes;
}

export async function storeScenes(scenes: Map<string, Scene>, supabase: ReturnType<typeof createClient<Database>>) {
	const fitlered_scenes = Array.from(scenes.values()).filter(i => i.monster_respawns.length > 0);
	const monsters = loadMonsters("C_Monster.ini", "T_Monster.ini");

	for (let i = 0; i < fitlered_scenes.length; i += 10) {
		console.log("Storing scenes", i, "to", i + 10);
		const fitlered_scenes_chunk = fitlered_scenes.slice(i, i + 10);
		const name_chunk = fitlered_scenes_chunk.map((i) => {
			const { name_translation, ...other } = i;
			return { id: i.name_translation_id, ...name_translation };
		});
		const scene_chunk = fitlered_scenes_chunk.map((i) => {
			const { monster_respawns, name_translation, ...other } = i;
			return {...other};
		});
		const monster_respawn_chunk = fitlered_scenes_chunk.map((i, idx) => {
			const { monster_respawns } = i;
			return monster_respawns.filter(mr => monsters.has(mr.monster_id)).map(mr => {
				const {id, ...other} = mr;
				return { scene_id: i.id, ...other };
			});
		}).flat();

		const { error: errorName, data: db_name } = await supabase.from(
			"translation",
		).upsert(name_chunk, { onConflict: "id" }).select();
		if (errorName) {
			console.log(name_chunk);
			console.error(errorName);
			return;
		}

		const res = await fetch(process.env.PUBLIC_SUPABASE_URL + "/rest/v1/scene", {
			method: "POST",
			headers: {
				"apikey": process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Authorization": "Bearer " + process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Content-Type": "application/json",
				"Prefer": "resolution=merge-duplicates"
			},
			body: JSON.stringify(scene_chunk),
		});
		if (!res.ok) {
			console.log(scene_chunk);
			console.error("Failed to store scenes", await res.text());
			return;
		}

		const res2 = await fetch(process.env.PUBLIC_SUPABASE_URL + "/rest/v1/scene_monster_respawn", {
			method: "POST",
			headers: {
				"apikey": process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Authorization": "Bearer " + process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
				"Content-Type": "application/json",
				"Prefer": "resolution=merge-duplicates"
			},
			body: JSON.stringify(monster_respawn_chunk),
		});
		if (!res2.ok) {
			console.log(monster_respawn_chunk);
			console.error("Failed to store monster respawns", await res2.text());
			return;
		}
	}
}

export type Recipe = {
	id: number;
	elf_skill_type: number;
	craft_type: number;
	unknown?: string;
	min_level: number;
	max_level: number;
	unknown2?: string;
	unknown3?: string;
	unknown4?: string;
	unknown5?: string;
	price: number; // Let's store as bigint
	result_id: number;
	unknown6?: string; // Might be result quantity if > 1
	ingredients: {item_id: number, unknown?: string, quantity: number}[]; // 3 items
	unknown7?: string;
	unknown8?: string;
	unknown9?: string; // Might be probability of success (I have no clue tbh)
	// More unknowns here
	// TODO: figure them out 🤷‍♂️
}

export function loadRecipes() {
	const lines = gfParse("resources/C_ElfCombine.ini");
	lines.shift();
	const recipes: Recipe[] = [];
	for (const line of lines) {
		const recipe: Recipe = {
			id: parseInt(line[0]),
			elf_skill_type: parseInt(line[1]),
			craft_type: parseInt(line[2]),
			min_level: parseInt(line[4]),
			max_level: parseInt(line[5]),
			price: parseInt(line[10]),
			result_id: parseInt(line[11]),
			ingredients: [],
		};
		for (let i = 0; i < 3; i++) {
			const item_id = parseInt(line[16 + i * 3]);
			const quantity = parseInt(line[18 + i * 3]);
			if (item_id) recipe.ingredients.push({item_id, quantity});
		}
		if (recipe.id) recipes.push(recipe);
	}

	return recipes;
}

export async function storeRecipes(recipes: Recipe[], supabase: ReturnType<typeof createClient<Database>>) {
	const items = loadItems("C_Item.ini", "T_Item.ini");

	for (let i = 0; i < recipes.length; i += 500) {
		console.log("Storing recipes", i, "to", i + 500);
		const chunk = recipes.slice(i, i + 500);
		const filtered_chunk = chunk.filter(r => items.find(i => i.id == r.result_id));

		const recipe_chunk = filtered_chunk.map((i) => {
			const { ingredients, ...other } = i;
			return {...other};
		});

		const { data, error} = await supabase.from("recipe").upsert(recipe_chunk, { onConflict: "id" }).select("id");
		if (error || !data) {
			console.error("Failed to store recipes", error);
			return;
		}

		const recipe_ingredient_chunk = filtered_chunk.map((i, idx) => {
			const { ingredients } = i;
			return ingredients.map(ing => {
				return { recipe_id: i.id, item_id: ing.item_id, quantity: ing.quantity };
			}).filter(ing => items.find(it => it.id === ing.item_id));
		}).flat();

		const {data: data2, error: error2} = await supabase.from("recipe_ingredient").upsert(recipe_ingredient_chunk).select("recipe_id, item_id");
		if (error2 || !data2) {
			console.error("Failed to store recipe ingredients", error2);
			return;
		}
	}
}

async function refresh_db() {
	const supabase = createClient(
		process.env.PUBLIC_SUPABASE_URL!,
		process.env.PRIVATE_SUPABASE_SERVICE_KEY!,
	);

	// console.log("Loading texts...");
	// console.time("Texts loaded");
	// const texts = loadTexts("T_TextIndex.ini");
	// await storeTexts(Array.from(texts.values()), supabase);
	// console.timeEnd("Texts loaded");

	// console.log("Loading items...");
	// console.time("Items loaded");
	// const items = loadItems("C_Item.ini", "T_Item.ini");
	// await storeItems(items, supabase);
	// console.timeEnd("Items loaded");

	// console.time("Mall Items loaded");
	// const mall_items = loadItems("C_ItemMall.ini", "T_ItemMall.ini");
	// await storeItems(mall_items, supabase);
	// console.timeEnd("Mall Items loaded");

	// console.time("Monsters loaded");
	// const monsters = loadMonsters("C_Monster.ini", "T_Monster.ini");
	// await storeMonsters(monsters, supabase);
	// console.timeEnd("Monsters loaded");

	// console.time("Drop Items loaded");
	// const drop_items = loadDropItems("C_DropItem.ini");
	// await storeDropItems(drop_items, supabase);
	// console.timeEnd("Drop Items loaded");

	// console.time("Scenes loaded");
	// const scenes = loadScenes();
	// await storeScenes(scenes, supabase);
	// console.timeEnd("Scenes loaded");

	console.time("Recipes loaded");
	const recipes = loadRecipes();
	await storeRecipes(recipes, supabase);
	console.timeEnd("Recipes loaded");
}

refresh_db().then(() => {
	console.log("Database refreshed");
	process.exit(0);
}).catch((error) => {
	console.error("Failed to refresh database", error);
	process.exit(1);
});