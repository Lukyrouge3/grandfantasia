<script lang="ts">
	import { getClasses, getClassesStringFromList } from "$lib/gf/class";
	import { getTexts } from "$lib/gf/texts";
	import type { Database } from "$lib/supabase";
	import type { createBrowserClient } from "@supabase/ssr";
	import { onMount } from "svelte";

	let { supabase, classes = $bindable() }: {
		supabase: ReturnType<typeof createBrowserClient<Database>>;
		classes: string;
	} = $props();

	let rows: {id: number, name: string, span?: number, active?: boolean}[][] = $state([
		[
			{ id: 0, name: '278', span: 14 },
			{ id: 1, name: '279', span: 2 },
			{ id: 2, name: '280', span: 2 },
			{ id: 3, name: '281' },
			{ id: 17, name: '10332' },
			{ id: 32, name: '11931' },
			{ id: 40, name: '13110' }
		],
		[
			{ id: 4, name: '282' },
			{ id: 18, name: '10333' },
			{ id: 33, name: '11932' },
			{ id: 41, name: '13111' }
		],
		[
			{ id: 5, name: '283', span: 2 },
			{ id: 6, name: '284', span: 2 },
			{ id: 7, name: '285' },
			{ id: 19, name: '10334' },
			{ id: 34, name: '11933' },
			{ id: 42, name: '13112' }
		],
		[
			{ id: 8, name: '286' },
			{ id: 20, name: '10335' },
			{ id: 35, name: '11934' },
			{ id: 43, name: '13113' }
		],
		[
			{ id: 9, name: '287', span: 2 },
			{ id: 10, name: '288', span: 2 },
			{ id: 11, name: '289' },
			{ id: 21, name: '10336' },
			{ id: 36, name: '11935' },
			{ id: 44, name: '13114' }
		],
		[
			{ id: 12, name: '290' },
			{ id: 22, name: '10337' },
			{ id: 37, name: '11936' },
			{ id: 45, name: '13115' }
		],
		[
			{ id: 13, name: '291', span: 2 },
			{ id: 14, name: '292', span: 2 },
			{ id: 15, name: '293' },
			{ id: 23, name: '10338' },
			{ id: 38, name: '11937' },
			{ id: 46, name: '13116' }
		],
		[
			{ id: 16, name: '294' },
			{ id: 24, name: '10339' },
			{ id: 39, name: '11938' },
			{ id: 47, name: '13117' }
		],
		[
			{ id: 25, name: '13871', span: 2 },
			{ id: 26, name: '13872', span: 2 },
			{ id: 27, name: '13873' },
			{ id: 29, name: '13875' },
			{ id: 48, name: '13877' },
			{ id: 50, name: '13879' }
		],
		[
			{ id: 28, name: '13874' },
			{ id: 30, name: '13876' },
			{ id: 49, name: '13878' },
			{ id: 51, name: '13880' }
		],
		[
			{ id: 52, name: '15489', span: 2 },
			{ id: 53, name: '15490', span: 2 },
			{ id: 54, name: '15491' },
			{ id: 56, name: '15493' },
			{ id: 58, name: '15495' },
			{ id: 60, name: '15497' }
		],
		[
			{ id: 55, name: '15492' },
			{ id: 57, name: '15494' },
			{ id: 59, name: '15496' },
			{ id: 61, name: '15498' }
		]
	]);

	let texts: Promise<{ en: string; es: string; fr: string; id: string; pt: string; }[]> = $state(Promise.resolve([]));

	onMount(() => {
		if (classes != "") {
			const class_array = getClasses(classes);
			rows = rows.map(row => row.map(cell => ({ ...cell, active: class_array.includes(cell.id) })));
		}
		texts = getTexts(rows.flat().map(c => c.name), "fr", supabase);
		texts.then(data => {
			rows.forEach(row => {
				row.forEach(cell => {
					const text = data.find(t => t.id === "textIndex_" + cell.name);
					if (text)
						cell.name = text.fr;
				});
			});
		});
	})

	// let classes = $derived(getClassesStringFromList(rows.flat().filter(f => f.active).map(c => c.id)));
	$effect(() => {
		classes = getClassesStringFromList(rows.flat().filter(f => f.active).map(c => c.id));
	});

	const handleClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (target.tagName === 'TD') {
			const value = target.getAttribute('data-value');
			const cell = rows.flat().find(c => c.id == parseInt(value || "-1"));
			if (cell)
				cell.active = !cell.active;
		}
	};
</script>

<!-- <p class="text-white mb-4">Result: {classes}</p> -->
<table class="text-white">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	{#await texts}
		<!-- <Spinner /> -->
	{:then _}
		<tbody onclick={handleClick}>
			{#each rows as row}
				<tr class="">
					{#each row as cell}
						<td rowspan={cell.span} data-value={cell.id} class="px-2 py-1 border border-white hover:bg-gray-700 {cell.active ? "bg-green-300/30" : ""}">{cell.name}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	{/await}
</table>
