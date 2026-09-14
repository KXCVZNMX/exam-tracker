<script lang="ts">
	import type { PageData } from './$types';
	import { Plus, X } from '@lucide/svelte';
	import AddExam from '$lib/components/modals/AddExam.svelte';
	import { truncateByWidth } from '$lib/util/general';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();
	let show = $state(false);
	let deleting = $state(false);
</script>

<AddExam bind:show sections={data.subject.numSections} />

<div class="p-5">
	<h1 class="pt-10 text-5xl font-bold">{data.subject.name}</h1>

	<div class="mb-4 flex justify-end">
		<button
			class="md:rounded-btn btn aspect-square rounded-full px-0 btn-md btn-primary md:aspect-auto md:px-4"
			aria-label="Add Exams"
			onclick={() => (show = true)}
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

					<th class="w-[35%]">Comments</th>
					<th class="w-[5%]"></th>
				</tr>
			</thead>

			<tbody>
				{#each data.subjectExams as exam, i (i)}
					<tr class="transition-all duration-100 hover:bg-base-200/70">
						<td>{exam.company}</td>
						<td>{exam.year}</td>
						<td>{exam.dateCompleted ? exam.dateCompleted.toLocaleDateString() : 'Incomplete'}</td>
						{#each exam.sections as section, j (j)}
							<td>{section.sectionScore}/{section.sectionFullScore}</td>
						{/each}
						<td>{truncateByWidth(exam.comments[0] ?? '', 48)}</td>
						<td>
							<form
								method="POST"
								action="?/deleteExam"
								use:enhance={() => {
									deleting = true;
									return async ({ update }) => {
										deleting = false;
										await update();
									};
								}}
							>
								<input type="hidden" name="subjectId" value={data.subject._id} />
								<input type="hidden" name="examId" value={exam._id} />
								<button
									type="submit"
									aria-label="Delete exam"
									class="rounded-full transition-all duration-100 hover:bg-base-300"
									disabled={deleting}
								>
									<X size={15} />
								</button>
							</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
