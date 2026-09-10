<script>
	import { EllipsisVertical, X } from '@lucide/svelte';
</script>

<div class="card h-50 w-full min-w-0 rounded-lg bg-base-200">
	<div class="card-body">
		<div class="flex h-full flex-col gap-2">
			<div class="flex-between flex">
				<p class="h-fit text-left text-2xl leading-none font-semibold max-block-6">Methods</p>

				<!-- TODO: Button for editing subject info and deleting subject-->
				<div class="flex flex-row gap-2 text-gray-300">
					<button
						class="rounded-full p-0.5 hover:bg-base-100 active:bg-gray-800"
						aria-label="Modify Subject"
					>
						<EllipsisVertical />
					</button>
					<button
						class="rounded-full p-0.5 hover:bg-base-100 active:bg-gray-800"
						aria-label="Delete Subject"
					>
						<X />
					</button>
				</div>
			</div>

			<p class="text-md text-gray-300/70 italic">
				This is a description does this wrap This is a description does this wrap This is a
			</p>
		</div>
	</div>
</div>
