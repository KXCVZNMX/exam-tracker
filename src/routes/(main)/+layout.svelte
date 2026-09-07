<script>
    import Sidebar from '$lib/components/Sidebar.svelte';
    let { children } = $props(); // Svelte 5 runes mode
</script>

<div class="app-layout">
    <Sidebar />
    <main>
        {@render children()}
    </main>
</div>