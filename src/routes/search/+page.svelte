<script lang="ts">
	import { Card, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

	const { data } = $props();
	const { items } = data;

</script>

<div class="mx-auto flex w-1/2 flex-col justify-center mt-8">
	<!-- {#each items as item}
		<div class="flex flex-row items-center gap-8 border border-gray-400">
			<img src={item.icon_filename} alt={item.name} class="h-10 w-10" />
			<h2 class="text-quality-{item.item_quality}">{item.item_name!['fr']}</h2>
		</div>
	{/each} -->
	<Table>
		<TableHead>
			<TableHeadCell class="w-2/12 text-center"></TableHeadCell>
			<TableHeadCell class="w-9/12">Name</TableHeadCell>
			<TableHeadCell class="w-1/12 text-center">Level</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each items as item}
				<TableBodyRow>
					<TableBodyCell><img src="itemicon/{item.icon_filename}.png" alt="" class="w-10 h-10 mx-auto"/></TableBodyCell>
					<TableBodyCell class=""><a class="text-quality-{item.item_quality} hover:underline" href="/item/{item.id}">{item.item_name!['fr']}</a></TableBodyCell>
					<TableBodyCell class="text-center">{item.restrict_level || 1}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
