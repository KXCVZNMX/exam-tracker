<script lang="ts">
	import { EllipsisVertical } from '@lucide/svelte';
	import { truncateByWidth } from '$lib/util/general';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import EditSubject from '$lib/components/modals/EditSubject.svelte';

	let {
		title,
		description,
		subjectId,
		numSections
	}: { title: string; description: string; subjectId: string; numSections: number } = $props();

	let deleting = $state(false);
	let showEdit = $state(false);

	const href = $derived(resolve(`/subjects/${subjectId}`));

	function visit() {
		if (!deleting) goto(href);
	}

	function onCardKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			visit();
		}
	}
</script>

<EditSubject bind:show={showEdit} {title} {description} {numSections} {subjectId} />

<div
	class="card h-50 w-full min-w-0 rounded-lg bg-base-200 transition-all duration-200 hover:cursor-pointer hover:bg-base-300"
	onclick={visit}
	onkeydown={onCardKeydown}
	role="link"
	tabindex="0"
	aria-label={`Visit subject ${title}`}
>
	<div class="card-body">
		<div class="flex h-full flex-col gap-2">
			<div class="flex-between flex">
				<p class="h-fit text-left text-2xl leading-none font-semibold max-block-6">
					{truncateByWidth(title, 18)}
				</p>

				<!-- TODO: Button for editing subject info and deleting subject-->
				<div class="flex flex-row gap-2 text-gray-300">
					<button
						type="button"
						class="rounded-full p-0.5 hover:bg-base-100 active:bg-gray-800"
						aria-label="Modify Subject"
						onclick={(e) => {
							e.stopPropagation();
							showEdit = true;
						}}
					>
						<EllipsisVertical />
					</button>
				</div>
			</div>

			<p class="text-md text-gray-300/70 italic">
				{truncateByWidth(description, 200)}
			</p>
		</div>
	</div>
</div>
