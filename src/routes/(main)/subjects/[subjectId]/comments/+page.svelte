<script lang="ts">
	import { Check, FileText, Plus, Search, Save, Trash } from '@lucide/svelte';
	import { renderMarkdown } from '$lib/util/renderMarkdown';
	import type { Comments } from '$lib/types/subjects';
	import type { PageData } from './$types';
	import AddComment from '$lib/components/modals/AddComment.svelte';
	import { deserialize } from '$app/forms';
	import { onMount } from 'svelte';
	import { beforeNavigate, invalidateAll } from '$app/navigation';

	type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

	let { data }: { data: PageData } = $props();

	let showAddComment = $state(false);
	let selectedCommentId = $state('');
	let searchQuery = $state('');
	let saveStatus = $state<SaveStatus>('idle');
	let saveError = $state<string | null>(null);
	let deleting = $state(false);
	let editorEl = $state<HTMLTextAreaElement>();
	let previewEl = $state<HTMLDivElement>();
	let syncingScroll = false;

	let comments = $derived<Comments[]>(data.subjectComments.flatMap((exam) => exam.comments));
	let selectedComment = $derived(
		comments.find((comment) => comment.id === selectedCommentId) ?? comments[0]
	);
	let editorContent = $derived(selectedComment?.content ?? '');
	let selectedExamId = $derived(
		data.subjectComments.find((exam) =>
			exam.comments.some((comment) => comment.id === selectedComment?.id)
		)?.examId
	);
	let renderedMarkdown = $derived(renderMarkdown(editorContent));
	let isDirty = $derived(editorContent !== (selectedComment?.content ?? ''));

	onMount(() => {
		function handleBeforeUnload(event: BeforeUnloadEvent) {
			if (!isDirty) return;
			event.preventDefault();
			// Chrome requires returnValue to be set
			event.returnValue = '';
		}

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	});

	// Warn on in-app (client-side) navigation
	beforeNavigate((navigation) => {
		if (!isDirty) return;
		if (!confirm('You have unsaved changes. Leave without saving?')) {
			navigation.cancel();
		}
	});

	async function saveComment() {
		if (!selectedComment || !selectedExamId) return;

		saveStatus = 'saving';
		saveError = null;

		const formData = new FormData();
		formData.set('commentId', selectedComment.id);
		formData.set('content', editorContent);
		// It is guaranteed (hopefully) that subjectComments.length > 0
		formData.set('examId', selectedExamId);

		try {
			const res = await fetch(`?/saveComment`, {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await res.text());
			if (result.type !== 'success') throw new Error(`Save failed (${res.status})`);

			// commit the buffer into the underlying object only after success
			selectedComment.content = editorContent;
			saveStatus = 'saved';
		} catch (err) {
			saveStatus = 'error';
			saveError = err instanceof Error ? err.message : 'Unknown error';
		}
	}

	async function deleteComment() {
		if (!selectedComment || !selectedExamId) return;

		const message = isDirty
			? 'This comment has unsaved changes. Delete it without saving?'
			: `Delete "${selectedComment.title}"? This cannot be undone.`;

		if (!confirm(message)) return;

		deleting = true;

		const formData = new FormData();
		formData.set('commentId', selectedComment.id);
		// It is guaranteed (hopefully) that subjectComments.length > 0
		formData.set('examId', selectedExamId);

		try {
			const res = await fetch(`?/deleteComment`, {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await res.text());
			if (result.type !== 'success') throw new Error(`Delete failed (${res.status})`);

			const deletedId = selectedComment.id;

			await invalidateAll();

			if (selectedCommentId === deletedId) {
				selectedCommentId = '';
			}
		} catch (e) {
			throw new Error(`Delete failed: ${(e as Error).message}`, { cause: e });
		} finally {
			deleting = false;
		}
	}

	function updateContent(event: Event) {
		editorContent = (event.currentTarget as HTMLTextAreaElement).value;
	}

	function selectComment(id: string) {
		if (isDirty && !confirm('Discard unsaved changes?')) return;
		selectedCommentId = id;
		saveStatus = 'idle';
	}

	function syncScroll(source: HTMLElement, target: HTMLElement) {
		if (syncingScroll) return;
		syncingScroll = true;

		const sourceMax = source.scrollHeight - source.clientHeight;
		const targetMax = target.scrollHeight - target.clientHeight;

		if (sourceMax > 0 && targetMax > 0) {
			target.scrollTop = (source.scrollTop / sourceMax) * targetMax;
		}

		// release on next frame so the target's own scroll event (if any) doesn't re-trigger this
		requestAnimationFrame(() => {
			syncingScroll = false;
		});
	}

	function handleEditorScroll() {
		if (!editorEl || !previewEl) return;
		syncScroll(editorEl, previewEl);
	}

	function handlePreviewScroll() {
		if (!editorEl || !previewEl) return;
		syncScroll(previewEl, editorEl);
	}
</script>

<svelte:head>
	<title>Comments</title>
</svelte:head>

<AddComment bind:show={showAddComment} subjectComments={data.subjectComments} />

<div class="flex h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden p-4 md:p-5">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Comment editor</h1>
		<div class="flex items-center gap-2 text-sm text-base-content/60">
			{#if saveStatus === 'saved'}
				<span class="flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5">
					<Check size={14} class="text-success" /> Saved
				</span>
			{:else if saveStatus === 'saving'}
				<span class="rounded-full bg-base-200 px-3 py-1.5">Saving…</span>
			{:else if saveStatus === 'error'}
				<span class="rounded-full bg-error/20 px-3 py-1.5 text-error">{saveError}</span>
			{/if}
		</div>
	</div>

	<div
		class="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-box border border-base-content/10 bg-base-100 shadow-sm lg:grid-cols-[minmax(14rem,0.85fr)_minmax(20rem,1.35fr)_minmax(20rem,1.5fr)]"
	>
		<!-- Comment file explorer -->
		<aside class="flex min-h-72 min-w-0 flex-col border-base-content/10 bg-base-200/45 lg:border-r">
			<div class="flex items-center justify-between border-b border-base-content/10 px-4 py-2.75">
				<div>
					<p class="text-xs font-semibold tracking-[0.14em] text-base-content/55 uppercase">
						Comments
					</p>
					<h2 class="mt-0.5 font-semibold">My comments</h2>
				</div>
				<button
					class="btn btn-circle btn-ghost btn-sm"
					type="button"
					aria-label="Create a comment"
					onclick={() => (showAddComment = true)}
				>
					<Plus size={17} />
				</button>
			</div>

			<label
				class="rounded-btn mx-3 my-3 flex items-center gap-2 border border-base-content/10 bg-base-100 px-3"
			>
				<Search size={15} class="shrink-0 text-base-content/45" />
				<span class="sr-only">Search comments</span>
				<input
					class="input w-full border-0 bg-transparent px-0 input-sm focus:outline-0"
					placeholder="Search comments"
					bind:value={searchQuery}
				/>
			</label>

			<nav class="min-h-0 flex-1 overflow-y-auto px-2 pb-3" aria-label="Comments">
				<p class="px-2 pb-2 text-xs font-medium text-base-content/45">EXAMS</p>
				{#each data.subjectComments as examComments, examIndex (examIndex)}
					{@const matchingComments = examComments.comments.filter((comment) =>
						comment.title.toLowerCase().includes(searchQuery.toLowerCase())
					)}
					{#if matchingComments.length > 0}
						<details class="mb-2 rounded-box bg-base-100/60" open>
							<summary class="cursor-pointer px-3 py-2 text-sm font-semibold hover:bg-base-300/60">
								<div class="flex items-center justify-between gap-2">
									<span>{examComments.year} {examComments.company}</span>
									<span class="badge badge-ghost badge-sm">{matchingComments.length}</span>
								</div>
							</summary>
							<div class="px-1 pb-1">
								{#each matchingComments as comment (comment.id)}
									<button
										type="button"
										class:menu-active={selectedCommentId === comment.id}
										class="group mb-1 flex w-full items-start gap-3 rounded-box px-3 py-2.5 text-left transition-colors hover:bg-base-300/70"
										onclick={() => selectComment(comment.id)}
									>
										<FileText size={16} class="mt-0.5 shrink-0 text-primary/75" />
										<span class="min-w-0 flex-1">
											<span class="block truncate text-sm font-medium">{comment.title}</span>
											<span class="mt-0.5 block text-xs text-base-content/50"
												>{comment.updated.toLocaleDateString()}</span
											>
										</span>
									</button>
								{/each}
							</div>
						</details>
					{/if}
				{:else}
					<p class="px-3 py-4 text-sm text-base-content/55">No comments found.</p>
				{/each}
			</nav>
		</aside>

		<!-- Markdown editor -->
		<section
			class="flex min-h-96 min-w-0 flex-col border-base-content/10 lg:border-r"
			aria-label="Comment editor"
		>
			<div
				class="flex items-center justify-between gap-3 border-b border-base-content/10 px-4 py-3"
			>
				<div class="min-w-0">
					<p class="text-xs font-semibold tracking-[0.14em] text-base-content/55 uppercase">
						Editing
					</p>
					<h2 class="truncate font-semibold">{selectedComment?.title ?? 'New comment'}</h2>
				</div>
				<div class="flex items-center gap-1.5">
					<button
						class="btn btn-ghost text-error btn-sm hover:bg-error/10 hover:text-error"
						type="button"
						aria-label="Delete comment"
						onclick={deleteComment}
						disabled={deleting}
					>
						<Trash size={15} />
						<span class="hidden sm:inline">
							{deleting ? 'Deleting...' : 'Delete'}
						</span>
					</button>

					<button
						class="btn gap-1.5 btn-ghost btn-sm"
						type="button"
						aria-label="Save comment"
						onclick={saveComment}
						disabled={saveStatus === 'saving'}
					>
						<Save size={15} />
						<span class="hidden sm:inline">
							{saveStatus === 'saving' ? 'Saving…' : 'Save'}
						</span>
					</button>
				</div>
			</div>
			<div
				class="flex items-center gap-2 border-b border-base-content/10 px-4 py-2 text-xs text-base-content/55"
			>
				<span class="badge badge-ghost badge-sm">Markdown</span>
				<span>Use $...$ or $$...$$ for KaTeX math</span>
			</div>
			<textarea
				bind:this={editorEl}
				onscroll={handleEditorScroll}
				class="min-h-0 flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 outline-none placeholder:text-base-content/35"
				oninput={updateContent}
				aria-label="Edit comment in Markdown"
				placeholder="Write a comment in Markdown...">{editorContent}</textarea
			>
		</section>

		<!-- Markdown and KaTeX preview -->
		<section class="flex min-h-96 min-w-0 flex-col" aria-label="Rendered preview">
			<div class="flex items-center justify-between border-b border-base-content/10 px-4 py-3">
				<div>
					<p class="text-xs font-semibold tracking-[0.14em] text-base-content/55 uppercase">
						Preview
					</p>
					<h2 class="font-semibold">Rendered comment</h2>
				</div>
			</div>
			<div
				bind:this={previewEl}
				onscroll={handlePreviewScroll}
				class="comment-preview min-h-0 flex-1 overflow-y-auto p-5 text-sm leading-6"
			>
				<!--eslint-disable-next-line svelte/no-at-html-tags-->
				{@html renderedMarkdown}
			</div>
		</section>
	</div>
</div>
