<script>
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { Menu, X } from '@lucide/svelte';
	let drawerOpen = $state(false);
	let { children } = $props(); // Svelte 5 runes mode
</script>

<div class="flex min-h-screen w-full flex-row">
	<Sidebar class="hidden md:flex" />
	{#if drawerOpen}
		<button
			class="fixed inset-0 z-40 bg-black/40 md:hidden"
			aria-label="Close menu"
			onclick={() => (drawerOpen = false)}
		></button>
		<div class="fixed inset-y-0 left-0 z-50 md:hidden">
			<div class="flex justify-end bg-base-200 p-2">
				<button
					class="btn btn-square btn-ghost"
					aria-label="Close menu"
					onclick={() => (drawerOpen = false)}><X /></button
				>
			</div>
			<Sidebar class="sticky! h-[93%]! min-h-0 flex-1" />
		</div>
	{/if}
	<main class="min-w-0 flex-1 pt-5 md:pl-5">
		<button
			class="btn ml-5 btn-square btn-ghost md:hidden"
			aria-label="Open menu"
			onclick={() => (drawerOpen = true)}><Menu /></button
		>
		{@render children()}
	</main>
</div>
