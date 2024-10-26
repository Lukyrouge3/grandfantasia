<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import Heading from 'flowbite-svelte/Heading.svelte';

	const { data } = $props();
	const { supabase } = data;

	const lang = "fr";

</script>

<div class="flex h-screen w-screen flex-col items-center justify-center">
	<Heading class="mb-8 text-center">Grand Fantasia Database</Heading>
	<div class="w-1/2">
		<Search {supabase} {lang} />
	</div>
</div>
