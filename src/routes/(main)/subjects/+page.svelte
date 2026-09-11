<script lang="ts">
	import SubjectCard from '$lib/components/SubjectCard.svelte';
	import { Plus } from '@lucide/svelte/icons';
	import AddSubject from '$lib/components/modals/AddSubject.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let showAddSubjectModal = $state(false);
</script>

<AddSubject bind:show={showAddSubjectModal} />

<div class="p-5">
	<h1 class="pt-10 text-5xl font-bold">Subjects</h1>

	<div class="mb-4 flex justify-end">
		<button
			class="md:rounded-btn btn aspect-square rounded-full px-0 btn-md btn-primary md:aspect-auto md:px-4"
			aria-label="Add Subjects"
			onclick={() => (showAddSubjectModal = true)}
		>
			<Plus />
			<span class="hidden md:inline">Add Subjects</span>
		</button>
	</div>

	<div class="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
		{#each data.subjects as subject (subject._id)}
			<SubjectCard
				title={subject.name}
				description={subject.description || ''}
				subjectId={subject._id}
			/>
		{/each}
	</div>
</div>
