<script lang="ts">
	import { X } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let {
		show = $bindable(false),
		sections
	}: {
		show?: boolean;
		sections: number;
	} = $props();
	let submitting = $state(false);
	let date = $state<string | null>(null);
	let calendarDate: HTMLElement & { value: string };

	onMount(() => {
		void import('cally');
	});

	$effect(() => {
		if (!calendarDate) return;
		const handleChange = () => {
			date = calendarDate.value || null;
		};
		calendarDate.addEventListener('change', handleChange);
		return () => calendarDate.removeEventListener('change', handleChange);
	});
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
			<input type="hidden" name="sections" value={sections} />

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
				<legend class="fieldset-legend">Date completed</legend>
				<input type="hidden" name="dateCompleted" value={date ?? ''} />
				<div class="flex flex-col gap-5 sm:flex-row">
					<button
						type="button"
						popovertarget="cally-popover1"
						class="input"
						id="cally1"
						style="anchor-name:--cally1"
					>
						{date || 'Pick a date'}
					</button>
					<button
						type="button"
						class="btn btn-md btn-secondary"
						onclick={() => {
							date = null;
							calendarDate.value = '';
						}}
					>
						Clear date
					</button>
				</div>
				<div
					popover
					id="cally-popover1"
					class="dropdown rounded-box bg-base-100 shadow-lg"
					style="position-anchor:--cally1"
				>
					<calendar-date bind:this={calendarDate} class="cally" value={date ?? ''}>
						<svg
							aria-label="Previous"
							{...{ slot: 'previous' }}
							class="size-4 fill-current"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							><path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
						</svg>
						<svg
							aria-label="Next"
							{...{ slot: 'next' }}
							class="size-4 fill-current"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
						</svg>
						<calendar-month></calendar-month>
					</calendar-date>
				</div>
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
