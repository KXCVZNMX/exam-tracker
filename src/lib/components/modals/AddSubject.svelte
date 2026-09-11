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

	<div class="modal-box max-w-5xl bg-base-100">
		<div class="mb-6 flex items-center justify-between">
			<h3 class="text-lg font-bold">Add Subject</h3>
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
			class="grid grid-cols-1 gap-6 sm:grid-cols-2"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					submitting = false;
					show = false;
					await update();
				}
			}}
		>
			<fieldset class="fieldset">
				<legend class="fieldset-legend"> Subject Name </legend>
				<input
					type="text"
					name="name"
					class="input w-full"
					placeholder="Methods, Physics, etc."
					maxlength="50"
					required
				/>
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend"> Subject Description </legend>
				<input
					type="text"
					name="description"
					class="input w-full"
					placeholder="Your goals, aims, etc."
					maxlength="400"
				/>
			</fieldset>

			<div class="col-span-full flex justify-end">
				<button type="submit" class="btn btn-primary" disabled={submitting}>
					{submitting ? 'Saving...' : 'Save'}
				</button>
			</div>
		</form>
	</div>
</dialog>
