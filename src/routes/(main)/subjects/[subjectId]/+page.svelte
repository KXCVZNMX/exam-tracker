<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';
	import { Plus, EllipsisVertical, Pen } from '@lucide/svelte';
	import AddExam from '$lib/components/modals/AddExam.svelte';
	import EditExam from '$lib/components/modals/EditExam.svelte';
	import { truncateByWidth } from '$lib/util/general';

	let { data }: { data: PageData } = $props();
	let show = $state(false);
	let showEdit = $state(false);
	let selectedExam = $state<PageData['subjectExams'][number] | null>(null);
</script>

<svelte:head>
	<title>
		{data.subject.name} Exams
	</title>
</svelte:head>

<AddExam bind:show sections={data.subject.numSections} />
{#if selectedExam}
	<EditExam
		bind:show={showEdit}
		exam={selectedExam}
		sections={data.subject.numSections}
		subjectId={data.subject._id}
	/>
{/if}

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
					<th class="w-[10%]">Company</th>
					<th class="w-[10%]">Year</th>
					<th class="w-[10%]">Date Completed</th>

					<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
					{#each { length: data.subject.numSections } as _, i (i)}
						<th style={`width: calc(25% / ${data.subject.numSections})`}>
							Section {i + 1}
						</th>
					{/each}

					<th class="w-[45%]">Comments</th>
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
						<td>
							<div class="flex items-center justify-between gap-3">
								<span>{truncateByWidth(exam.comments[0]?.title ?? '', 48)}</span>
								<a
									class="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-base-content/60 transition-[background-color,color,box-shadow] duration-200 hover:bg-base-300 hover:text-base-content hover:shadow-sm hover:shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:shadow-none motion-reduce:transition-none"
									href={resolve(
										`/subjects/${data.subject._id}/comments`
									)}
									aria-label={`Edit comments for ${exam.company} ${exam.year}`}
								>
									<Pen size={12} />
								</a>
							</div>
						</td>
						<td>
							<button
								type="button"
								aria-label="Edit Exam (except comments)"
								class="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-base-content/60 transition-[background-color,color,box-shadow] duration-200 hover:bg-base-300 hover:text-base-content hover:shadow-sm hover:shadow-black/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:shadow-none motion-reduce:transition-none"
								onclick={() => {
									selectedExam = exam;
									showEdit = true;
								}}
							>
								<EllipsisVertical size={14} />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
