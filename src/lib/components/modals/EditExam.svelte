<script lang="ts">
	import { X } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	type ExamSection = {
		sectionNum: number;
		sectionScore: number;
		sectionFullScore: number;
	};

	type Exam = {
		_id: string;
		company: string;
		year: number;
		dateCompleted: Date | string | null;
		sections: ExamSection[];
	};

	let {
		show = $bindable(false),
		exam,
		sections,
		subjectId
	}: {
		show?: boolean;
		exam: Exam;
		sections: number;
		subjectId: string;
	} = $props();

	let submitting = $state(false);
	let date = $state('');

	$effect(() => {
		const examId = exam._id;
		void examId;
		date = exam.dateCompleted ? new Date(exam.dateCompleted).toISOString().slice(0, 10) : '';
	});
</script>

<dialog class="modal p-4" class:modal-open={show}>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (show = false)}>close</button>
	</form>

	<div class="modal-box max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto bg-base-100">
		<div class="mb-6 flex items-center justify-between">
			<h3 class="text-lg font-bold">Edit Exam</h3>
			<button
				class="btn btn-circle btn-ghost btn-sm"
				aria-label="Close"
				onclick={() => (show = false)}
			>
				<X />
			</button>
		</div>

		<form
			method="POST"
			action="?/editExam"
			class="space-y-5"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					submitting = false;
					if (result.type === 'success') show = false;
					await update();
				};
			}}
		>
			<input type="hidden" name="examId" value={exam._id} />
			<input type="hidden" name="subjectId" value={subjectId} />
			<input type="hidden" name="sections" value={sections} />

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Company</legend>
				<input
					type="text"
					name="company"
					class="input w-full rounded-sm"
					value={exam.company}
					maxlength="20"
					required
				/>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Year</legend>
				<input
					type="number"
					name="year"
					class="input w-full rounded-sm"
					value={exam.year}
					min="1980"
					max="3000"
					required
				/>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Date completed</legend>
				<input type="date" name="dateCompleted" class="input" bind:value={date} />
			</fieldset>

			<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
			{#each Array(sections) as _, i (i)}
				{@const section = exam.sections[i]}
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Section {i + 1}</legend>
					<div class="flex items-center gap-2">
						<input
							type="number"
							name={`mark_${i}`}
							class="input w-full rounded-sm"
							value={section?.sectionScore ?? 0}
							min="0"
							required
						/>
						<span class="text-lg">/</span>
						<input
							type="number"
							name={`totalMark_${i}`}
							class="input w-full rounded-sm"
							value={section?.sectionFullScore ?? 1}
							min="1"
							required
						/>
					</div>
				</fieldset>
			{/each}

			<div class="flex justify-end gap-2 pt-2">
				<button type="button" class="btn btn-ghost" onclick={() => (show = false)}>Cancel</button>
				<button type="submit" class="btn btn-primary" disabled={submitting}>
					{submitting ? 'Saving...' : 'Save Exam'}
				</button>
			</div>
		</form>
	</div>
</dialog>
