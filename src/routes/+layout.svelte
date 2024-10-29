<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Navbar, NavBrand, NavHamburger, NavLi, NavUl, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	const { data, children } = $props();
	let { supabase, session } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	const changeLanguage = (new_lang: "fr" | "pt" | "es" | "en") => {
		// Take current window location
		const url = new URL(window.location.href);
		// Change the language
		url.pathname = `/${new_lang}${url.pathname.slice(3)}`;
		// Redirect to the new language
		window.location = url.toString();
	};
</script>

<Navbar>
	<NavBrand href="/">
		<!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Grand Fantasia Database</span>
	</NavBrand>
	<NavHamburger />
	<NavUl>
		<NavLi href="/">Home</NavLi>
		<NavLi class="cursor-pointer">
			Language<ChevronDownOutline class="w-6 h-6 ms-2 text-primary-800 dark:text-white inline" />
		  </NavLi>
		<Dropdown>
			<DropdownItem onclick={() => changeLanguage("fr")}>FR</DropdownItem>
			<DropdownItem onclick={() => changeLanguage("es")}>ES</DropdownItem>
			<DropdownItem onclick={() => changeLanguage("pt")}>PT</DropdownItem>
			<DropdownItem onclick={() => changeLanguage("en")}>EN</DropdownItem>
		</Dropdown>
		<!-- <NavLi href="/about">About</NavLi>
		<NavLi href="/docs/components/navbar">Navbar</NavLi>
		<NavLi href="/pricing">Pricing</NavLi>
		<NavLi href="/contact">Contact</NavLi> -->
	</NavUl>
</Navbar>

{@render children()}
