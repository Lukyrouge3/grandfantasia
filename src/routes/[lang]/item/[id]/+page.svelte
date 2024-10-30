<script lang="ts">
	import { statsFields } from '$lib/gf/item';
	import { Accordion, AccordionItem, Card, Table, TableHead, TableHeadCell, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	const { data } = $props();
	const { item, lang } = data;

	console.log(item);

	const tip_regex = /\$\d+\$[^$]*/gm;
	const color = (str: string) => {
		return str.split('$')[1];
	};

	const sorted_drops = item.drops.filter(d => {
		return d.stack && d.rand_times && d.monster
	}).sort((a, b) => {
		if (a.stack! * a.rand_times! == b.stack! * b.rand_times!) {
			return (b.monster!.level || 0) - (a.monster!.level || 0);
		}
		return (b.stack! * b.rand_times!) - (a.stack! * a.rand_times!);
	})

	console.log(lang);
</script>

<div class="mx-auto mt-8 flex justify-center">
	<div class="flex w-1/2 flex-col items-center gap-1 rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-md">
		<img src="/itemicon/{item.icon_filename}.png" alt="" class="h-16 w-16" />
		<h5 class="mb-1 text-lg font-medium text-white">{item.item_name[lang]}</h5>
		<span class="text-sm text-gray-400">ID: {item.id}</span>
		<span class="text-sm text-gray-400">Level {item.restrict_level || 1}</span>
		<Accordion class="mt-2 w-full">
			<AccordionItem>
				<span slot="header" class="text-white">Description</span>
				<p class="text-sm text-white">
					{#if item.item_tip[lang].match(tip_regex)}
						{#each item.item_tip[lang].match(tip_regex) || [] as tip}
							<span class="text-color-{color(tip)} whitespace-pre-line">{tip.split('$')[2]}</span>
						{/each}
					{:else}
						{item.item_tip[lang]}
					{/if}
				</p>
			</AccordionItem>
			<AccordionItem>
				<span slot="header" class="text-white">Stats</span>
				<div class="text-white flex flex-col text-left text-sm">
					{#each statsFields as field}
						{#if item[field.field]}
							{#if field.side == "right"}
								<div class="text-white">{field.label} +{field.format ? field.format(item[field.field]) : item[field.field]}</div>
							{:else}
								<div class="text-color-59">+{field.format ? field.format(item[field.field]) : item[field.field]} {field.label}</div>
							{/if}
						{/if}
					{/each}
				</div>
			</AccordionItem>
			<AccordionItem>
				<span slot="header" class="text-white">Drops</span>
				<Table class="text-white">
					<TableHead>
						<TableHeadCell>Monster</TableHeadCell>
						<TableHeadCell>Max drop / Kill</TableHeadCell>
						<TableHeadCell>Level</TableHeadCell>
						<TableHeadCell>Map</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each sorted_drops as drop}
						{@const scene = drop.monster!.scene_monster_respawn[0]}
							<TableBodyRow>
								<TableBodyCell><a class="underline" href="/monster/{drop.monster!.id}">{drop.monster!.name[lang]}</a></TableBodyCell>
								<TableBodyCell>{drop.stack * drop.rand_times!}</TableBodyCell>
								<TableBodyCell>{drop.monster!.level}</TableBodyCell>
								<TableBodyCell><a class="underline" href="/{lang}/scene/{scene.scene_id}">{scene.name[lang]}</a></TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</AccordionItem>
		</Accordion>
	</div>
</div>
