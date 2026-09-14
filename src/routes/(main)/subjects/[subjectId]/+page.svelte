<script lang="ts">
    import type { PageData } from './$types';
    import {Plus} from "@lucide/svelte";
    import AddExam from "$lib/components/modals/AddExam.svelte";
    import {truncateByWidth} from "$lib/util/general";

    let { data }: { data: PageData } = $props();
    let show = $state(false);
</script>

<AddExam bind:show={show} sections={data.subject.numSections}/>

<div class="p-5">
    <h1 class="pt-10 text-5xl font-bold">{data.subject.name}</h1>

    <div class="mb-4 flex justify-end">
        <button
                class="md:rounded-btn btn aspect-square rounded-full px-0 btn-md btn-primary md:aspect-auto md:px-4"
                aria-label="Add Exams"
                onclick={() => show = true}
        >
            <Plus />
            <span class="hidden md:inline">Add Exams</span>
        </button>
    </div>

    <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table class="table">
            <thead>
                <tr>
                    <th class="w-[15%]">Company</th>
                    <th class="w-[10%]">Year</th>
                    <th class="w-[5%]">Done</th>

                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each { length: data.subject.numSections } as _, i (i)}
                        <th style={`width: calc(30% / ${data.subject.numSections})`}>
                            Section {i + 1}
                        </th>
                    {/each}

                    <th class="w-[40%]">Comments</th>
                </tr>
            </thead>

            <tbody>
                {#each data.subjectExams as exam, i (i)}
                    <tr class="hover:bg-base-200/70 transition-all duration-100">
                        <td>{exam.company}</td>
                        <td>{exam.year}</td>
                        <td>{exam.dateCompleted.toLocaleDateString()}</td>
                        {#each exam.sections as section, j (j)}
                            <td>{section.sectionScore}/{section.sectionFullScore}</td>
                        {/each}
                        <td>{truncateByWidth(exam.comments[0] ?? '', 48)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>