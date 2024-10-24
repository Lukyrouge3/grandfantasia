import type Redis from "ioredis-rejson";
import iconv from "iconv-lite";
import fs from "node:fs";
import { gfParse } from "./parser";
import { redis } from "$lib/redis";
import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL } from "$env/static/public";
import { PRIVATE_SUPABASE_SERVICE_KEY } from "$env/static/private";

export type Item = {
	id: number;
	icon_filename: string;
	model_id: string;
	model_filename: string;
	weapon_effect_id: number;
	fly_effect_id: number;
	used_effect_id: number;
	used_sound_name: string;
	enhance_effect_id: number;
	name: string;
	item_type: number;
	equip_type: number;
	op_flags: number;
	op_flags_plus: number;
	target: number;
	restrict_gender: number;
	restrict_level: number;
	restrict_max_level: number;
	rebirth_count: number;
	rebirth_score: number;
	rebirth_max_score: number;
	restrict_align: number;
	restrict_prestige: number;
	restrict_class: string;
	item_quality: number;
	item_group: number;
	casting_time: number;
	cooldown_time: number;
	cooldown_group: number;
	max_hp: number;
	max_mp: number;
	str: number;
	vit: number;
	int: number;
	will: number;
	agi: number;
	avg_physical_damage: number;
	rand_physical_damage: number;
	attack_range: number;
	attack_speed: number;
	attack: number;
	range_attack: number;
	physical_defence: number;
	magic_damage: number;
	magic_defence: number;
	hit_rate: number;
	dodge_rate: number;
	physical_critical_rate: number;
	physical_critical_damage: number;
	magic_critical_rate: number;
	magic_critical_damage: number;
	physical_penetration: number;
	magic_penetration: number;
	physical_penetration_defence: number;
	magic_penetration_defence: number;
	attribute: number;
	attribute_rate: number;
	attribute_damage: number;
	attribute_resist: number;
	special_type: number;
	special_rate: number;
	special_damage: number;
	drop_rate: number;
	drop_index: number;
	treasure_buffs1: number;
	treasure_buffs2: number;
	treasure_buffs3: number;
	treasure_buffs4: number;
	enchant_type: number;
	enchant_id: number;
	expert_level: number;
	expert_enchant_id: number;
	elf_skill_id: number;
	enchant_time_type: number;
	enchant_duration: number;
	limit_type: number;
	due_date_time: number;
	backpack_size: number;
	max_socket: number;
	socket_rate: number;
	max_durability: number;
	max_stack: number;
	shop_price_type: number;
	sys_price: number;
	restrict_event_pos_id: string;
	unknown_string: string;
	block_rate: number;
	log_level: number;
	auction_type: number;
	extra_data1: number;
	extra_data2: number;
	extra_data3: number;
	tip: string;
	name_translation: Record<string, string>;
	tip_translation: Record<string, string>;
};

export const maxDropItem = 45;
export type DropItemData = {
	id: number;
	name: string;
	level: number;
	dropGoldRate: number;
	avgGold: number;
	randGold: number;
	randTimes: number;
	notDropRate: number;
	greenRate: number;
	blueRate: number;
	orangeRate: number;
	yellowRate: number;
	unknown1: number;
	dropItems: DropItem[];
	unknownString: string;
};

export type DropItem = {
	itemId: number;
	itemName: string;
	stack: number;
	rate: number;
};

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
				restrict_level: parseInt(line[16]),
				restrict_max_level: parseInt(line[17]),
				rebirth_count: parseInt(line[18]),
				rebirth_score: parseInt(line[19]),
				rebirth_max_score: parseInt(line[20]),
				restrict_align: parseInt(line[21]),
				restrict_prestige: parseInt(line[22]),
				restrict_class: line[23],
				item_quality: parseInt(line[24]),
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

export async function cacheItems(items: Item[]): Promise<void> {
	await Promise.all(
		items.map((item) => redis.json_set(`item:${item.id}`, ".", item)),
	);
}

export async function storeItems(items: Item[]): Promise<void> {
	const supabase = createClient(
		PUBLIC_SUPABASE_URL,
		PRIVATE_SUPABASE_SERVICE_KEY,
	);
	// const item_chunk = items.map((i) => {
	// 	const { name_translation, tip_translation, ...other } = i;
	// 	return other;
	// });
	const name_translation_chunk = items.map((i, idx) => {
		const { name_translation } = i;
		return { item_id: i.id, ...name_translation };
	});
	const tip_translation_chunk = items.map((i, idx) => {
		const { tip_translation } = i;
		return { item_id: i.id, ...tip_translation };
	});
	// const { error: errorItem, data: db_item } = await supabase.from("item")
	// 	.upsert(item_chunk).select("id");
	// if (errorItem) {
	// 	console.error(errorItem);
	// 	return;
	// }
	const { error: errorName, data: db_name } = await supabase.from(
		"item_name_translation",
	).upsert(name_translation_chunk, { onConflict: "item_id" }).select();
	if (errorName) {
		console.error(errorName);
		return;
	}
	const { error: errorTip, data: db_tip } = await supabase.from(
		"item_tip_translation",
	).upsert(tip_translation_chunk, { onConflict: "item_id" }).select();
	if (errorTip) {
		console.error(errorTip);
		return;
	}
}

// let str = iconv.decode(fileData, 'win1252');
