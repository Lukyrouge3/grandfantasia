import type { Tables } from "$lib/supabase";

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
	item_quality: string;
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

// let str = iconv.decode(fileData, 'win1252');

export type StatsField = {
    field: keyof Tables<'item'>,
    label: string,
    side: 'left' | 'right',
    format?: (value: any) => string,
    type: 'integer' | 'float' | 'text'
}

export const divideBy10 = (val: number) => {
    return (val / 10).toFixed(1);
}

export const statsFields: StatsField[] = [
    { field: 'attack', label: 'ATK', side: 'right', type: 'integer'},
    { field: 'range_attack', label: 'R-ATK', side: 'right', type: 'integer'},
    { field: 'magic_damage', label: 'M-ATK', side: 'right', type: 'integer'},
    { field: 'physical_defence', label: 'DEF', side: 'right', type: 'integer'},
    { field: 'magic_defence', label: 'M-DEF', side: 'right', type: 'integer'},
    { field: 'attack_speed', label: 'SPD', side: 'right', format: divideBy10, type: 'float'},
    { field: 'str', label: 'STR', side: 'right', type: 'integer'},
    { field: 'vit', label: 'VIT', side: 'right', type: 'integer'},
    { field: 'int', label: 'INT', side: 'right', type: 'integer'},
    { field: 'will', label: 'WIL', side: 'right', type: 'integer'},
    { field: 'agi', label: 'AGI', side: 'right', type: 'integer'},
    { field: 'max_hp', label: 'HP', side: 'left', type: 'integer'},
    { field: 'max_mp', label: 'MP', side: 'left', type: 'integer'},
    { field: 'hit_rate', label: '% chance of hit', side: 'left', type: 'integer'},
    { field: 'dodge_rate', label: '% chance to evade', side: 'left', type: 'integer'},
    { field: 'block_rate', label: '% chance to block', side: 'left', type: 'integer'},
    { field: 'physical_critical_rate', label: '% chance for a critical hit', side: 'left', format: divideBy10, type: 'float'},
    { field: 'physical_critical_damage', label: '% critical hit damage', side: 'left', type: 'integer'},
    { field: 'magic_critical_rate', label: '% chance for a magic critical hit', side: 'left', format: divideBy10, type: 'float'},
    { field: 'magic_critical_damage', label: '% magic critical hit damage', side: 'left', type: 'integer'},
    { field: 'physical_penetration', label: '% physical PEN', side: 'left', format: divideBy10, type: 'float'},
    { field: 'magic_penetration', label: '% magic PEN', side: 'left', format: divideBy10, type: 'float'},
    { field: 'physical_penetration_defence', label: '% physical PEN reduction', side: 'left', format: divideBy10, type: 'float'},
    { field: 'magic_penetration_defence', label: '% magic PEN reduction', side: 'left', format: divideBy10, type: 'float'},
]