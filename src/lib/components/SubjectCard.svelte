<script lang="ts">
	import { EllipsisVertical, X } from '@lucide/svelte';
	import { truncateByWidth } from '$lib/util/general';
	import { enhance } from '$app/forms';

	let { title, description, subjectId }: { title: string; description: string; subjectId: string } =
		$props();

	let deleting = $state(false);
</script>

<div class="card h-50 w-full min-w-0 rounded-lg bg-base-200">
	<div class="card-body">
		<div class="flex h-full flex-col gap-2">
			<div class="flex-between flex">
				<p class="h-fit text-left text-2xl leading-none font-semibold max-block-6">
					{truncateByWidth(title, 18)}
				</p>

				<!-- TODO: Button for editing subject info and deleting subject-->
				<div class="flex flex-row gap-2 text-gray-300">
					<button
						class="rounded-full p-0.5 hover:bg-base-100 active:bg-gray-800"
						aria-label="Modify Subject"
					>
						<EllipsisVertical />
					</button>

					<form
						method="POST"
						action="?/deleteSubject"
						use:enhance={() => {
							deleting = true;
							return async ({ update }) => {
								deleting = false;
								await update();
							};
						}}
					>
						<input type="hidden" name="id" value={subjectId} />

						<!-- TODO: Make this have a warning-->
						<button
							class="rounded-full p-0.5 hover:bg-base-100 active:bg-gray-800"
							aria-label="Delete Subject"
							type="submit"
							disabled={deleting}
						>
							<X />
						</button>
					</form>
				</div>
			</div>

			<p class="text-md text-gray-300/70 italic">
				{truncateByWidth(description, 200)}
			</p>
		</div>
	</div>
</div>
