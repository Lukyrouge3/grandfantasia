<script lang="ts">
	import { browser } from '$app/environment';
	import { getTexts } from '$lib/gf/texts';
	import { Input, Button, Label, Select, MultiSelect } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';
	import Heading from 'flowbite-svelte/Heading.svelte';

	const { data } = $props();
	const { supabase } = data;

	const lang = "fr";
	let search = $state("");
	let item_types: number[] = $state([]);

	const item_type_options = [
		{ value: -1, name: "763", disabled: true},
		{ value: 1, name: "23"},
		{ value: 2, name: "24"},
		{ value: 3, name: "25"},
		{ value: 4, name: "26"},
		{ value: 5, name: "27"},
		{ value: 6, name: "28"},
		{ value: 18, name: "63"},
		{ value: 21, name: "40"},
		{ value: -2, name: "762", disabled: true},
		{ value: 7, name: "29"},
		{ value: 8, name: "30"},
		{ value: 9, name: "31"},
		{ value: 10, name: "32"},
		{ value: 11, name: "33"},
		{ value: 12, name: "34"},
		{ value: 13, name: "35"},
		{ value: 14, name: "36"},
		{ value: 15, name: "37"},
		{ value: 16, name: "38"},
		{ value: 17, name: "39"},
		{ value: 19, name: "43"},
		{ value: 20, name: "44"},
		{ value: -3, name: "9632", disabled: true},
		{ value: 22, name: "41"},
		{ value: 23, name: "42"},
		{ value: 24, name: "16121"},
		{ value: 25, name: "46"},
	]

	const class_options = [
		{ value: 0, name: "91" }
	]

	const text_ids = [...item_type_options.map(item => parseInt(item.name)), ...class_options.map(item => parseInt(item.name))];
	const texts = getTexts(text_ids, lang, supabase);

	texts.then(data => {
		item_type_options.forEach(item => {
			const text = data.find(text => text.id == parseInt(item.name));
			if (text)
				item.name = text[lang];
		});
		class_options.forEach(item => {
			const text = data.find(text => text.id == parseInt(item.name));
			if (text)
				item.name = text[lang];
		});
	});

	const search_to_query = () => {
		const urlParams = new URLSearchParams({
			q: search.trim(),
			types: item_types.join(",")
		});

		const to_delete: string[] = [];
		for (const [key, value] of urlParams.entries()) {
			console.log(key, value);
			if (value == "") to_delete.push(key);
		}
		to_delete.forEach(key => urlParams.delete(key));

		return urlParams.toString();
	}
	
	const handleSearch = () => {
		const query = search_to_query();
		if (query.trim() == "") return;
		// Redirect to the search page
		if (browser)
			window.location.href = `/search?${search_to_query()}`;
	};
</script>

<div class="flex h-screen w-screen flex-col items-center justify-center">
	<Heading class="mb-8 text-center">Grand Fantasia Database</Heading>
	<div class="w-1/2">
		<form action="" onsubmit={handleSearch} class="flex flex-col gap-4">
			<Input id="search" type="text" placeholder="Search for an item..." size={"lg"} bind:value={search}>
				<Button slot="right" size="lg" color="primary" class="h-10 w-10" type="submit">
					<SearchOutline class="h-5 w-5 text-white" />
				</Button>
			</Input>
			<div class="flex flex-row gap-4">
				<Label class="w-1/2">
					Filter by category
					<MultiSelect class="mt-2" items={item_type_options} bind:value={item_types}/>
				</Label>
				<Label class="w-1/2">
					Filter by class
					<MultiSelect class="mt-2" items={class_options} bind:value={item_types}/>
				</Label>
			</div>
		</form>
	</div>
</div>
