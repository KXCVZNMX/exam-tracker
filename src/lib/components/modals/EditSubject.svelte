<script lang="ts">
	import { X } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let {
		show = $bindable(false),
		title,
		description,
		numSections,
		subjectId
	}: {
		show?: boolean;
		title: string;
		description: string;
		numSections: number;
		subjectId: string;
	} = $props();
	let submitting = $state(false);
	let deleting = $state(false);
</script>

<dialog class="modal" class:modal-open={show}>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (show = false)}>close</button>
	</form>

	<div class="modal-box max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto bg-base-100">
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h3 class="text-lg font-bold">Edit Subject</h3>
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
			action="?/editSubject"
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
			<input type="hidden" name="subjectId" value={subjectId} />
			<fieldset class="fieldset">
				<legend class="fieldset-legend"> Subject Name </legend>
				<input
					type="text"
					name="name"
					class="input w-full rounded-sm"
					placeholder="Methods, Physics, etc."
					maxlength="50"
					value={title}
					required
				/>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend"> Subject Description </legend>
				<textarea
					name="description"
					class="textarea w-full rounded-sm"
					maxlength="400"
					rows="3"> {description} </textarea>
			</fieldset>

			<div class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-end">
				<fieldset class="fieldset w-full sm:flex-1">
					<legend class="fieldset-legend">Number of Sections</legend>
					<input
						type="number"
						name="sections"
						class="input w-full rounded-sm"
						value={numSections}
						min="1"
						max="4"
						required
					/>
				</fieldset>

				<div class="flex gap-2 pb-0 sm:pb-1">
					<button type="button" class="btn btn-ghost" onclick={() => (show = false)}>
						Cancel
					</button>

					<button type="submit" class="btn btn-primary" disabled={submitting}>
						{submitting ? 'Saving...' : 'Save Subject'}
					</button>
				</div>
			</div>
		</form>

		<form
			method="POST"
			action="?/deleteSubject"
			class="mt-6"
			use:enhance={() => {
				deleting = true;
				return async ({ result, update }) => {
					deleting = false;
					if (result.type === 'success') show = false;
					await update();
				};
			}}
		>
			<input type="hidden" name="id" value={subjectId} />
			<fieldset class="fieldset rounded-box border border-error p-4">
				<legend class="fieldset-legend text-error">Danger zone</legend>
				<p class="text-sm">
					Permanently delete this subject and all of its exams. This cannot be undone.
				</p>
				<button type="submit" class="btn mt-2 btn-error" disabled={submitting || deleting}>
					{deleting ? 'Deleting...' : 'Delete Subject'}
				</button>
			</fieldset>
		</form>
	</div>
</dialog>
