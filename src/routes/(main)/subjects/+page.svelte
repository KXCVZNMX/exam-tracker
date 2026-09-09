<script>
    import SubjectCard from "$lib/components/SubjectCard.svelte";
    import {Plus} from "@lucide/svelte/icons"
</script>

<div class="p-5">
    <h1 class="font-bold text-5xl pt-10">
        Subjects
    </h1>

    <div class="flex justify-end mb-4">
        <button class="btn btn-primary btn-md aspect-square rounded-full px-0 md:aspect-auto md:rounded-btn md:px-4" aria-label="Add Subjects">
            <Plus />
            <span class="hidden md:inline">Add Subjects</span>
        </button>
    </div>

    <div class="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <SubjectCard />
        <SubjectCard />
        <SubjectCard />
    </div>
</div>
