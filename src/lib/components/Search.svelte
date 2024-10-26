<script lang="ts">
	import { browser } from "$app/environment";
	import { getTexts } from "$lib/gf/texts";
	import type { Database } from "$lib/supabase";
	import type { createBrowserClient } from "@supabase/ssr";
	import { Button, Input, Label, Spinner, ButtonGroup } from "flowbite-svelte";
	import { SearchOutline, ChevronDownOutline, ChevronUpOutline } from "flowbite-svelte-icons";
	import Modal from "flowbite-svelte/Modal.svelte";
	import MultiSelect from "flowbite-svelte/MultiSelect.svelte";
	import Class from "./Class.svelte";

	const {
		supabase, 
		lang = 'fr', 
		search: initial_search = "", 
		types: initial_types = [],
		classes: initial_classes = "",
		min_level: initial_min_level = "0",
		max_level: initial_max_level = "100",
		page = $bindable(1)
	}: {
		supabase: ReturnType<typeof createBrowserClient<Database>>,
		lang: 'fr' | 'en' | 'es' | 'pt',
		search?: string | null,
		classes?: string | null,
		types?: number[] | null,
		min_level?: string | null,
		max_level?: string | null,
		page?: number | null
	} = $props();

	let search = $state(initial_search || "");
	let item_types: number[] = $state(initial_types || []);
	let classes: string = $state(initial_classes || "");
	let min_level = $state(parseInt(initial_min_level || "0"));
	let max_level = $state(parseInt(initial_max_level || "100"));

	let class_modal_visible = $state(false);
	let filters_visible = $state(true);

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

	const text_ids = [...item_type_options.map(item => item.name)];
	const texts = getTexts(text_ids, lang, supabase);

	texts.then(data => {
		item_type_options.forEach(item => {
			const text = data.find(text => text.id == "textIndex_" + item.name);
			if (text)
				item.name = text[lang];
		});
	});

	const search_to_query = () => {
		const urlParams = new URLSearchParams({
			q: search.trim(),
			types: item_types.length > 0 ? item_types.join(",") : "",
			classes: classes,
			min_level: min_level > 0 ? min_level.toString() : "",
			max_level: max_level < 100 ? max_level.toString() : "",
			page: (page || "").toString()
		});

		const to_delete: string[] = [];
		for (const [key, value] of urlParams.entries()) {
			if (value == "") to_delete.push(key);
		}
		to_delete.forEach(key => urlParams.delete(key));

		return urlParams.toString();
	}
	
	export const handleSearch = () => {
		const query = search_to_query();
		// if (query.trim() == "") return;
		// Redirect to the search page
		if (browser)
			window.location.href = `/search?${search_to_query()}`;
	};

	const openClassModal = (e: Event) => {
		e.preventDefault();
		// Open the class modal
		class_modal_visible = true;
	}

	const onClassChange = (value: string) => {
		classes = value;
	};

	const handleClassReset = () => {
		classes = "";
		handleSearch();
	}
</script>


<form action="" onsubmit={handleSearch} class="flex flex-col gap-4">
	<Input id="search" type="text" placeholder="Search for an item..." size={"lg"} bind:value={search}>
		<!-- <Button slot="right" size="lg" color="primary" class="h-10 w-10" type="submit">
			<SearchOutline class="h-5 w-5 text-white" />
		</Button> -->
	</Input>
	<Button type="button" color="alternative" class="w-full" onclick={() => filters_visible = !filters_visible}>
		{#if filters_visible}
			<ChevronUpOutline /> Show filters <ChevronUpOutline />
		{:else}
			<ChevronDownOutline /> Show filters <ChevronDownOutline />
		{/if}
	</Button>	
	{#if filters_visible}
		<div class="flex flex-col">
			<div class="flex flex-row gap-4">
				<Label class="">
					Min level
					<Input type="number" class="mt-2" bind:value={min_level} min="0" max="100"/>
				</Label>
				<Label class="">
					Max level
					<Input type="number" class="mt-2" bind:value={max_level} min="0" max="100"/>
				</Label>
				{#await texts}
					<Spinner class="w-10 h-10 text-primary-500" />
				{:then _} 
					<Label class="w-1/2">
						Filter by category
						<MultiSelect class="mt-2" items={item_type_options} bind:value={item_types} placeholder="Pick categories"/>
					</Label>
				{/await}
				
			</div>
			<div class="flex flex-row gap-4 mt-4">
				<ButtonGroup>
					<Button type="button" color="alternative" class="" onclick={openClassModal}>
						Classes
					</Button>
					<Input id="classes" type="text" bind:value={classes} disabled placeholder="Filter the classes" onclick={openClassModal}/>
				</ButtonGroup>
			</div>
		</div>		
	{/if}
	<Button class="w-full" type="submit">Search</Button>
</form>

<Modal title="Filter classes" bind:open={class_modal_visible} outsideclose autoclose size="lg">
	<div class="flex flex-col justify-center items-center">
		<Class {supabase} bind:classes={classes} />
		<ButtonGroup>
			<Button color="alternative" class="mt-4" onclick={handleClassReset}>
				Reset
			</Button>
			<Button color="primary" class="mt-4" onclick={handleSearch}>
				Apply
			</Button>
		</ButtonGroup>
	</div>
</Modal>