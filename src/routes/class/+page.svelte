<script lang="ts">
	import Class from "$lib/components/Class.svelte";

	const { data } = $props();
	const { supabase } = data;

	const onClassChange = (value: string) => {
		console.log(value);
	};
</script>
<Class {supabase} onChange={onClassChange} />