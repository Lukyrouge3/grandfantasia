<script lang="ts">
	import PageSelector from '$lib/components/PageSelector.svelte';
	import Search from '$lib/components/Search.svelte';
	import { Card, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	const { data } = $props();
	const { items, supabase, name, types, max_level, min_level, classes, object_count, page: initial_page, page_size, lang } = data;
	let page = $state(initial_page);
	let search: ReturnType<typeof Search>;

	const onPageChange = (newPage: number) => {
		page = newPage;
		search.handleSearch();
	};

</script>

<div class="mx-auto flex w-1/2 flex-col justify-center mt-8">
	<Search {supabase} search={name || ""} {types} {max_level} {min_level} {classes} bind:page bind:this={search} {lang} />
	<PageSelector {object_count} {page_size} {page} pageChange={onPageChange} />
	<Table class="mt-2">
		<TableHead>
			<TableHeadCell class="w-2/12 text-center"></TableHeadCell>
			<TableHeadCell class="w-9/12">Name</TableHeadCell>
			<TableHeadCell class="w-1/12 text-center">Level</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each items as item}
				<TableBodyRow>
					<TableBodyCell><img src="/itemicon/{item.icon_filename}.png" alt="" class="w-10 h-10 mx-auto"/></TableBodyCell>
					<TableBodyCell class=""><a class="text-quality-{item.item_quality} hover:underline" href="/{lang}/item/{item.id}">{item.item_name![lang]}</a></TableBodyCell>
					<TableBodyCell class="text-center">{item.restrict_level || 1}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
	<PageSelector {object_count} {page_size} {page} pageChange={onPageChange} />
</div>
