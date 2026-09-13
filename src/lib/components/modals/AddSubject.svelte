<script lang="ts">
	import { X } from '@lucide/svelte';
	import { enhance } from '$app/forms';

	let { show = $bindable(false) }: { show?: boolean } = $props();
	let submitting = $state(false);
</script>

<dialog class="modal" class:modal-open={show}>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (show = false)}>close</button>
	</form>

	<div class="modal-box max-w-2xl bg-base-100">
		<div class="mb-6 flex items-center justify-between">
			<div>
				<h3 class="text-lg font-bold">Add Subject</h3>
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
			action="?/addSubject"
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
				<legend class="fieldset-legend"> Subject Name </legend>
				<input
					type="text"
					name="name"
					class="input w-full rounded-sm"
					placeholder="Methods, Physics, etc."
					maxlength="50"
					required
				/>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend"> Subject Description </legend>
				<textarea
					name="description"
					class="textarea w-full rounded-sm"
					placeholder="Your goals, aims, etc."
					maxlength="400"
					rows="3"
				></textarea>
			</fieldset>

			<fieldset class="fieldset w-full sm:w-1/2">
				<legend class="fieldset-legend">Number of Sections</legend>
				<input
					type="number"
					name="sections"
					class="input w-full rounded-sm"
					min="1"
					max="4"
					required
				/>
			</fieldset>

			<div class="flex justify-end gap-2 pt-2">
				<button
						type="button"
						class="btn btn-ghost"
						onclick={() => (show = false)}
				>
					Cancel
				</button>

				<button type="submit" class="btn btn-primary" disabled={submitting}>
					{submitting ? 'Saving...' : 'Save Subject'}
				</button>
			</div>
		</form>
	</div>
</dialog>
