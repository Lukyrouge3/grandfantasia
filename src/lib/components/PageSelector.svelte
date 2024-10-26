<script lang="ts">
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import {
		ChevronDoubleRightOutline,
		ChevronRightOutline,
		ChevronDoubleLeftOutline,
		ChevronLeftOutline
	} from 'flowbite-svelte-icons';

	const {
		page,
		page_size = 10,
		object_count,
		pageChange
	}: {
		page: number;
		page_size: number;
		object_count: number;
		pageChange: (newPage: number) => void;
	} = $props();

	const max_page = Math.ceil(object_count / page_size);
</script>

<p class="mt-8 text-center text-white">
	Results: {Math.min(page * page_size, object_count)}/{object_count} (Showing {page_size})
</p>
<ButtonGroup class="mt-2">
	{#if page > 2}
		<Button on:click={() => pageChange(1)}>
			<ChevronDoubleLeftOutline />
		</Button>
	{/if}
	{#if page > 1}
		<Button on:click={() => pageChange(page - 1)}>
			<ChevronLeftOutline />
		</Button>
	{/if}
	{#each Array(4) as _, i}
		{#if page + i - 4 > 0}
			<Button on:click={() => pageChange(page + i - 5)} disabled={page + i - 5 == page}
				>{page + i - 5}</Button
			>
		{/if}
	{/each}
	{#each Array(5) as _, i}
		{#if page + i <= max_page}
			<Button on:click={() => pageChange(page + i)} disabled={page + i == page}>{page + i}</Button>
		{/if}
	{/each}
	{#if page < max_page}
		<Button on:click={() => pageChange(page + 1)}>
			<ChevronRightOutline />
		</Button>
	{/if}
	{#if page < max_page - 1}
		<Button on:click={() => pageChange(Math.ceil(object_count / page_size))}>
			<ChevronDoubleRightOutline />
		</Button>
	{/if}
</ButtonGroup>
