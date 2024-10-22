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
	iconFilename: string;
	modelId: string;
	modelFilename: string;
	weaponEffectId: number;
	flyEffectId: number;
	usedEffectId: number;
	usedSoundName: string;
	enhanceEffectId: number;
	name: string;
	itemType: number;
	equipType: number;
	opFlags: number;
	opFlagsPlus: number;
	target: number;
	restrictGender: number;
	restrictLevel: number;
	restrictMaxLevel: number;
	rebirthCount: number;
	rebirthScore: number;
	rebirthMaxScore: number;
	restrictAlign: number;
	restrictPrestige: number;
	restrictClass: string;
	itemQuality: number;
	itemGroup: number;
	castingTime: number;
	cooldownTime: number;
	cooldownGroup: number;
	maxHp: number;
	maxMp: number;
	str: number;
	vit: number;
	int: number;
	will: number;
	agi: number;
	avgPhysicalDamage: number;
	randPhysicalDamage: number;
	attackRange: number;
	attackSpeed: number;
	attack: number;
	rangeAttack: number;
	physicalDefence: number;
	magicDamage: number;
	magicDefence: number;
	hitRate: number;
	dodgeRate: number;
	physicalCrititicalRate: number;
	physicalCrititicalDamage: number;
	magicCrititicalRate: number;
	magicCrititicalDamage: number;
	physicalPenetration: number;
	magicPenetration: number;
	physicalPenetrationDefence: number;
	magicPenetrationDefence: number;
	attribute: number;
	attributeRate: number;
	attributeDamage: number;
	attributeResist: number;
	specialType: number;
	specialRate: number;
	specialDamage: number;
	dropRate: number;
	dropIndex: number;
	treasureBuffs1: number;
	treasureBuffs2: number;
	treasureBuffs3: number;
	treasureBuffs4: number;
	enchantType: number;
	enchantId: number;
	expertLevel: number;
	expertEnchantId: number;
	elfSkillId: number;
	enchantTimeType: number;
	enchantDuration: number;
	limitType: number;
	dueDateTime: number;
	backpackSize: number;
	maxSocket: number;
	socketRate: number;
	maxDurability: number;
	maxStack: number;
	shopPriceType: number;
	sysPrice: number;
	restrictEventPosId: string;
	unknownString: string;
	blockRate: number;
	logLevel: number;
	auctionType: number;
	extraData1: number;
	extraData2: number;
	extraData3: number;
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
				iconFilename: line[1],
				modelId: line[2],
				modelFilename: line[3],
				weaponEffectId: parseInt(line[4]),
				flyEffectId: parseInt(line[5]),
				usedEffectId: parseInt(line[6]),
				usedSoundName: line[7],
				enhanceEffectId: parseInt(line[8]),
				name: line[9],
				itemType: parseInt(line[10]),
				equipType: parseInt(line[11]),
				opFlags: parseInt(line[12]),
				opFlagsPlus: parseInt(line[13]),
				target: parseInt(line[14]),
				restrictGender: parseInt(line[15]),
				restrictLevel: parseInt(line[16]),
				restrictMaxLevel: parseInt(line[17]),
				rebirthCount: parseInt(line[18]),
				rebirthScore: parseInt(line[19]),
				rebirthMaxScore: parseInt(line[20]),
				restrictAlign: parseInt(line[21]),
				restrictPrestige: parseInt(line[22]),
				restrictClass: line[23],
				itemQuality: parseInt(line[24]),
				itemGroup: parseInt(line[25]),
				castingTime: parseInt(line[26]),
				cooldownTime: parseInt(line[27]),
				cooldownGroup: parseInt(line[28]),
				maxHp: parseInt(line[29]),
				maxMp: parseInt(line[30]),
				str: parseInt(line[31]),
				vit: parseInt(line[32]),
				int: parseInt(line[33]),
				will: parseInt(line[34]),
				agi: parseInt(line[35]),
				avgPhysicalDamage: parseInt(line[36]),
				randPhysicalDamage: parseInt(line[37]),
				attackRange: parseInt(line[38]),
				attackSpeed: parseInt(line[39]),
				attack: parseInt(line[40]),
				rangeAttack: parseInt(line[41]),
				physicalDefence: parseInt(line[42]),
				magicDamage: parseInt(line[43]),
				magicDefence: parseInt(line[44]),
				hitRate: parseInt(line[45]),
				dodgeRate: parseInt(line[46]),
				physicalCrititicalRate: parseInt(line[47]),
				physicalCrititicalDamage: parseInt(line[48]),
				magicCrititicalRate: parseInt(line[49]),
				magicCrititicalDamage: parseInt(line[50]),
				physicalPenetration: parseInt(line[51]),
				magicPenetration: parseInt(line[52]),
				physicalPenetrationDefence: parseInt(line[53]),
				magicPenetrationDefence: parseInt(line[54]),
				attribute: parseInt(line[55]),
				attributeRate: parseInt(line[56]),
				attributeDamage: parseInt(line[57]),
				attributeResist: parseInt(line[58]),
				specialType: parseInt(line[59]),
				specialRate: parseInt(line[60]),
				specialDamage: parseInt(line[61]),
				dropRate: parseInt(line[62]),
				dropIndex: parseInt(line[63]),
				treasureBuffs1: parseInt(line[64]),
				treasureBuffs2: parseInt(line[65]),
				treasureBuffs3: parseInt(line[66]),
				treasureBuffs4: parseInt(line[67]),
				enchantType: parseInt(line[68]),
				enchantId: parseInt(line[69]),
				expertLevel: parseInt(line[70]),
				expertEnchantId: parseInt(line[71]),
				elfSkillId: parseInt(line[72]),
				enchantTimeType: parseInt(line[73]),
				enchantDuration: parseInt(line[74]),
				limitType: parseInt(line[75]),
				dueDateTime: parseInt(line[76]),
				backpackSize: parseInt(line[77]),
				maxSocket: parseInt(line[78]),
				socketRate: parseInt(line[79]),
				maxDurability: parseInt(line[80]),
				maxStack: parseInt(line[81]),
				shopPriceType: parseInt(line[82]),
				sysPrice: parseInt(line[83]),
				restrictEventPosId: line[84],
				unknownString: line[85],
				blockRate: parseInt(line[86]),
				logLevel: parseInt(line[87]),
				auctionType: parseInt(line[88]),
				extraData1: parseInt(line[89]),
				extraData2: parseInt(line[90]),
				extraData3: parseInt(line[91]),
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
			const lines = gfParse("resources/translations/" + lang + "/" + translationFile);
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
	const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY);
	// Upsert 10 items at a time
	const chunkSize = 10;
	for (let i = 0; i < items.length; i += chunkSize) {
		const chunk = items.slice(i, i + chunkSize);
		console.log(`Storing items ${i} to ${i + chunkSize}`);
		fs.writeFileSync("resources/items.json", JSON.stringify(chunk, null, 2));
		break;
		const { data, error } = await supabase.from("items").upsert(chunk);
		if (error) {
			console.error(error);
		}
	}
}

// let str = iconv.decode(fileData, 'win1252');
