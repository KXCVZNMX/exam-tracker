<script lang="ts">
	import { X } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { renderMarkdown } from '$lib/util/renderMarkdown';

	let {
		show = $bindable(false),
		sections,
	}: {
		show?: boolean;
		sections: number;
	} = $props();
	let submitting = $state(false);
	let completed = $state(false);
	let comment = $state('');

	let renderedComment = $derived(renderMarkdown(comment));
</script>

<dialog class="modal p-4" class:modal-open={show}>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (show = false)}>close</button>
	</form>

	<div class="modal-box max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto bg-base-100">
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h3 class="text-lg font-bold">Add Exam</h3>
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
			action="?/addExam"
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
				<legend class="fieldset-legend">Company</legend>
				<input
					type="text"
					name="company"
					class="input w-full rounded-sm"
					placeholder="MAV, Kilbaha"
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
					placeholder="e.g. 2024"
					min="1980"
					max="3000"
					required
				/>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Completed</legend>
				<label class="label cursor-pointer justify-start gap-3">
					<input
						type="checkbox"
						name="completed"
						class="toggle toggle-primary"
						bind:checked={completed}
					/>
				</label>
			</fieldset>

			<!--eslint-disable-next-line @typescript-eslint/no-unused-vars-->
			{#each Array(sections) as _, i (i)}
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Section {i + 1}</legend>

					<div class="flex items-center gap-2">
						<input
							type="number"
							name={`mark_${i}`}
							class="input w-full rounded-sm"
							placeholder="Mark"
							min="0"
							value="0"
							required
						/>

						<span class="text-lg">/</span>

						<input
							type="number"
							name={`totalMark_${i}`}
							class="input w-full rounded-sm"
							placeholder="Total mark"
							min="1"
							required
						/>
					</div>
				</fieldset>
			{/each}

			<fieldset class="fieldset">
				<legend class="fieldset-legend">Comment</legend>

				<div class="grid overflow-hidden rounded-lg border border-base-300 md:grid-cols-2">
					<!-- Markdown source -->
					<div class="border-b border-base-300 md:border-r md:border-b-0">
						<div class="border-b border-base-300 bg-base-200 px-3 py-2">
							<span class="text-sm font-medium">Markdown</span>
						</div>

						<textarea
							name="comment"
							bind:value={comment}
							class="textarea h-64 w-full resize-none rounded-none border-0 focus:outline-none"
							placeholder={'# Comment\n\nWrite **Markdown** here.\n\nUse $x^2$ for inline math.\n\nUse $$\\frac{a}{b}$$ for display math.'}
							maxlength="4000"></textarea>
					</div>

					<!-- Preview -->
					<div>
						<div class="border-b border-base-300 bg-base-200 px-3 py-2">
							<span class="text-sm font-medium">Preview</span>
						</div>

						<div class="comment-preview h-64 max-w-none overflow-y-auto p-4">
							<!--eslint-disable-next-line svelte/no-at-html-tags-->
							{@html renderedComment}
						</div>
					</div>
				</div>
			</fieldset>

			<div class="flex justify-end gap-2 pt-2">
				<button type="button" class="btn btn-ghost" onclick={() => (show = false)}> Cancel </button>

				<button type="submit" class="btn btn-primary" disabled={submitting}>
					{submitting ? 'Saving...' : 'Save Exam'}
				</button>
			</div>
		</form>
	</div>
</dialog>

<style>
</style>
