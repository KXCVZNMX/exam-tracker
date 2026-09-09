<script lang="ts">
    import VcaaNoText from "$lib/assets/vcaa_no_text.svg"
    import {House, Library} from "@lucide/svelte";
    import {resolve} from "$app/paths";

    let { class: className = '' } = $props<{ class?: string }>();
</script>

<aside class={`sticky top-0 flex h-screen w-48 flex-col bg-base-200 shadow-xl ${className}`}>
    <div class="flex justify-center py-3">
        <img src={VcaaNoText} alt="VCAA logo" class="h-20 w-20 blur-[6px]" />
    </div>

    <nav class="flex-1 overflow-y-auto">
        <ul class="menu menu-vertical gap-2 p-3 w-full">
            <li class="w-full">
                <a class="btn btn-ghost w-full rounded-none font-normal" href={resolve('/')}>
                    <House /> Home
                </a>
            </li>
            <li class="w-full">
                <a class="btn btn-ghost w-full rounded-none font-normal" href={resolve('/(main)/subjects')}>
                    <Library /> Subjects
                </a>
            </li>
        </ul>
    </nav>
</aside>
