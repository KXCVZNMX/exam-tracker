<script lang="ts">
	import { X } from '@lucide/svelte';

	let { show = $bindable(false) }: { show?: boolean } = $props();
</script>

<dialog class="modal" class:modal-open={show}>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => (show = false)}>close</button>
	</form>

	<div class="modal-box max-w-5xl bg-base-100">
		<div class="mb-6 flex items-center justify-between">
			<h3 class="text-lg font-bold">
				Add Subject
			</h3>
			<button
					class="btn btn-circle btn-ghost btn-sm"
					aria-label="Close"
					onclick={() => (show = false)}
			>
				<X />
			</button>
		</div>

		<form class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">
					Subject Name
				</legend>
				<input type="text" class="input w-full" placeholder="Methods, Physics, etc." />
			</fieldset>

			<fieldset class="fieldset">
				<legend class="fieldset-legend">
					Subject Description
				</legend>
				<input type="text" class="input w-full" placeholder="Your goals, aims, etc." />
			</fieldset>
		</form>
	</div>
</dialog>