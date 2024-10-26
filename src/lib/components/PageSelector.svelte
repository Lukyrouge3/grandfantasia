<script lang="ts">
	import { Button, ButtonGroup } from "flowbite-svelte";
	import { CaretRightOutline } from "flowbite-svelte-icons";


	const { page, page_size = 10, object_count, pageChange }: { page: number, page_size: number, object_count: number, pageChange: (newPage: number) => void } = $props();

	const max_page = Math.ceil(object_count / page_size);
</script>

<ButtonGroup class="mt-8">
	{#if page > 1}
		<Button on:click={() => pageChange(page - 1)}>Previous</Button>
	{/if}
	<!-- Show the 5 buttons before page -->
	{#each Array(5) as _, i}
		{#if page + i - 5 > 0}
			<Button on:click={() => pageChange(page + i - 5)} disabled={page + i - 5 == page}>{page  + i - 5}</Button>
		{/if}
	{/each}
	{#each Array(5) as _, i}
		{#if page + i < max_page}
			<Button on:click={() => pageChange(page + i)} disabled={page + i == page}>{page + i}</Button>
		{/if}
	{/each}
	{#if page < Math.ceil(object_count / page_size)}
		<Button on:click={() => pageChange(page + 1)}>
			<CaretRightOutline /> 
		</Button>
	{/if}
</ButtonGroup>