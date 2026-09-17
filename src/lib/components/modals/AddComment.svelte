<script lang="ts">
	import { X } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import type { Comments } from '$lib/types/subjects';

	type CommentsWithName = {
		examId: string;
		company: string;
		year: number;
		comments: Comments[];
	};

	let {
		show = $bindable(false),
		subjectComments
	}: { show?: boolean; subjectComments: CommentsWithName[] } = $props();
	let submitting = $state(false);
</script>

<dialog class="modal" class:modal-open={show}>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (show = false)}>close</button>
	</form>

	<div class="modal-box max-w-2xl bg-base-100">
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h3 class="text-lg font-bold">Add Comment</h3>
			</div>

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
			action="?/addComment"
			class="space-y-5"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					show = false;
					await update();
				};
			}}
		>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Exam Paper</legend>

				<select name="examName" class="select w-full rounded-sm" required>
					<option value="" disabled selected>Select a exam</option>

					{#each subjectComments as subject, i (i)}
						<option value={subject.examId}>{subject.company} {subject.year}</option>
					{/each}
				</select>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend"> Title</legend>
				<input
					type="text"
					name="title"
					class="input w-full rounded-sm"
					placeholder="Wrong questions, Areas to improve..."
					maxlength="50"
				/>
			</fieldset>

			<div class="flex justify-end gap-2 pt-2">
				<button type="button" class="btn btn-ghost" onclick={() => (show = false)}> Cancel </button>

				<button type="submit" class="btn btn-primary" disabled={submitting}>
					{submitting ? 'Saving...' : 'Save Subject'}
				</button>
			</div>
		</form>
	</div>
</dialog>
