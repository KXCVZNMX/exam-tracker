<script>
    import { EllipsisVertical, X } from '@lucide/svelte';
</script>

<div class="card h-50 w-full min-w-0 rounded-lg bg-base-200">
    <div class="card-body">
        <div class="flex h-full flex-col gap-2">
            <div class="flex flex-between">
                <p class="max-block-6 text-left text-2xl leading-none h-fit font-semibold">
                    Methods
                </p>

                <!-- TODO: Button for editing subject info and deleting subject-->
                <div class="flex flex-row gap-2 text-gray-300">
                    <button class="rounded-full hover:bg-base-100 active:bg-gray-800 p-0.5" aria-label="Modify Subject">
                        <EllipsisVertical />
                    </button>
                    <button class="rounded-full hover:bg-base-100 active:bg-gray-800 p-0.5" aria-label="Delete Subject">
                        <X />
                    </button>
                </div>
            </div>

            <p class="text-md italic text-gray-300/70">
                This is a description does this wrap This is a description does this wrap This is a
            </p>

            <!--TODO: Make this a button to change colours -->
            <div class="mt-auto flex flex-row gap-2">
                <div class="size-4 rounded-sm" style="background-color: #de12ef"></div>
            </div>
        </div>
    </div>
</div>
