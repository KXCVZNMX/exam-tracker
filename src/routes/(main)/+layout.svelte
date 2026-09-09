<script>
    import Sidebar from '$lib/components/Sidebar.svelte';
    let { children } = $props(); // Svelte 5 runes mode
</script>

<div class="flex flex-row">
    <Sidebar />
    <main class="min-w-0 flex-1 pl-5 pt-5">
        {@render children()}
    </main>
</div>