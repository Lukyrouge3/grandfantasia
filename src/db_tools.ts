import dotenv from "dotenv";
dotenv.config();

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
				model_scales: parseInt(line[2]),
				name: line[3],
				level: parseInt(line[4]) || 0,
				rank: parseInt(line[5]),
				type: parseInt(line[6]),
				max_hp: parseInt(line[7]),
				max_mp: parseInt(line[8]),
				fear_type: parseInt(line[9]),
				part_hp: parseInt(line[10]),
				part_breaking_action: parseInt(line[11]),
				avg_physical_damage: parseInt(line[12]),
				rand_physical_damage: parseInt(line[13]),
				attack_range: parseInt(line[14]),
				attack_speed: parseInt(line[15]),
				attack: parseInt(line[16]),
				physical_defence: parseInt(line[17]),
				magic_damage: parseInt(line[18]),
				magic_defence: parseInt(line[19]),
				hit_rate: parseInt(line[20]),
				dodge_rate: parseInt(line[21]),
				physical_critical_rate: parseInt(line[22]),
				physical_critical_damage: parseInt(line[23]),
				magic_critical_rate: parseInt(line[24]),
				magic_critical_damage: parseInt(line[25]),
				physical_penetration: parseInt(line[26]),
				magical_penetration: parseInt(line[27]),
				physical_penetration_defence: parseInt(line[28]),
				magical_penetration_defence: parseInt(line[29]),
				attribute: parseInt(line[30]),
				attribute_damage: parseInt(line[31]),
				attribute_rate: parseInt(line[32]),
				attribute_resist: parseInt(line[33]),
				innate_buffs: line[34],
				rand_buff_num: parseInt(line[35]),
				random_buffs: line[36],
				casting_effect_id: parseInt(line[37]),
				roam_speed: parseInt(line[38]),
				pursuit_speed: parseInt(line[39]),
				move_range: parseInt(line[40]),
				detect_range: parseInt(line[41]),
				ai_id: parseInt(line[42]),
				max_call_help: parseInt(line[43]),
				monster_alignment: parseInt(line[44]),
				idle_spell_id: parseInt(line[45]),
				battle_spells: line[46],
				restore_spell_id: parseInt(line[47]),
				summon_monster_id: parseInt(line[48]),
				summon_type: parseInt(line[49]),
				summon_rate: parseInt(line[50]),
				summon_max: parseInt(line[51]),
				summon_effect_id: parseInt(line[52]),
				exp: parseInt(line[53]),
				shout: line[54],
				shout_for_man: line[55],
				shout_for_woman: line[56],
				zone_icon: line[57],
				locate_limit: parseInt(line[58]),
				achievement_map: line[59],
				auto_spell_during: line[60] === 'true',
				auto_spell_id: parseInt(line[61]),
				spell_shout_cmds: line[62],
				special_flag: parseInt(line[63]),
				lower_limit: parseInt(line[64]),
				name_translation: {},
				name_translation_id: "monster_name_" + line[0],
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

	console.log("Loading items...");
	console.time("Items loaded");
	const items = loadItems("C_Item.ini", "T_Item.ini");
	await storeItems(items, supabase);
	console.timeEnd("Items loaded");

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

}

refresh_db().then(() => {
	console.log("Database refreshed");
	process.exit(0);
}).catch((error) => {
	console.error("Failed to refresh database", error);
	process.exit(1);
});