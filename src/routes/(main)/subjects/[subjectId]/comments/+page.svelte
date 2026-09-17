<script lang="ts">
	import { BookOpen, Check, Clock3, Eye, FileText, Plus, Search, Save } from '@lucide/svelte';
	import { renderMarkdown } from '$lib/util/renderMarkdown';

	type CommentDraft = {
		id: string;
		title: string;
		updated: string;
		content: string;
	};

	// Placeholder data for the editor until comments are connected to the API.
	let comments = $state<CommentDraft[]>([
		{
			id: 'quadratic-functions',
			title: 'Quadratic functions',
			updated: 'Just now',
			content:
				'# Quadratic functions\n\nRemember to check the turning point before sketching the graph. For a quadratic in vertex form, the axis of symmetry is $x=h$.\n\n- Find the intercepts\n- Label the vertex\n- Check the domain and range\n\n$$f(x) = a(x-h)^2 + k$$'
		},
		{
			id: 'exam-timing',
			title: 'Exam timing plan',
			updated: 'Yesterday',
			content:
				'## Exam timing plan\n\nAllow **10 minutes** at the end to review working and units. Start with the questions that you can answer confidently, then return to the longer problems.'
		},
		{
			id: 'proof-reminders',
			title: 'Proof reminders',
			updated: '2 days ago',
			content:
				'## Proof reminders\n\nState the theorem you are using, then explain each implication. A clear chain of reasoning earns more marks than a page of unexplained algebra.'
		},
		{
			id: 'formula-sheet',
			title: 'Formula sheet ideas',
			updated: 'Last week',
			content:
				'# Formula sheet ideas\n\nGroup formulas by topic and include one small example beside each formula. Leave space for common mistakes discovered during practice.'
		}
	]);

	let selectedCommentId = $state('quadratic-functions');
	let searchQuery = $state('');
	let selectedComment = $derived(
		comments.find((comment) => comment.id === selectedCommentId) ?? comments[0]
	);
	let renderedMarkdown = $derived(renderMarkdown(selectedComment?.content ?? ''));
	let filteredComments = $derived(
		comments.filter((comment) => comment.title.toLowerCase().includes(searchQuery.toLowerCase()))
	);

	function selectComment(id: string) {
		selectedCommentId = id;
	}

	function updateContent(event: Event) {
		const value = (event.currentTarget as HTMLTextAreaElement).value;
		const comment = comments.find((item) => item.id === selectedCommentId);

		if (comment) comment.content = value;
	}
</script>

<svelte:head>
	<title>Comments</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-5rem)] flex-col gap-4 p-4 md:p-5">
	<div class="flex flex-wrap items-end justify-between gap-3">
		<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Comment editor</h1>
		<div class="flex items-center gap-2 text-sm text-base-content/60">
			<span class="flex items-center gap-1.5 rounded-full bg-base-200 px-3 py-1.5">
				<Check size={14} class="text-success" />
				Saved locally
			</span>
		</div>
	</div>

	<div
		class="grid min-h-0 flex-1 grid-cols-1 overflow-hidden rounded-box border border-base-content/10 bg-base-100 shadow-sm lg:grid-cols-[minmax(14rem,0.85fr)_minmax(20rem,1.35fr)_minmax(20rem,1.5fr)]"
	>
		<!-- Comment file explorer -->
		<aside
			class="flex min-h-72 min-w-0 flex-col border-base-content/10 bg-base-200/45 lg:border-r"
		>
			<div class="flex items-center justify-between border-b border-base-content/10 px-4 py-[11px]">
				<div>
					<p class="text-xs font-semibold tracking-[0.14em] text-base-content/55 uppercase">
						Files
					</p>
					<h2 class="mt-0.5 font-semibold">My comments</h2>
				</div>
				<button class="btn btn-circle btn-ghost btn-sm" type="button" aria-label="Create a comment">
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
				<p class="px-2 pb-2 text-xs font-medium text-base-content/45">NOTES</p>
				{#each filteredComments as comment (comment.id)}
					<button
						type="button"
						class:menu-active={selectedCommentId === comment.id}
						class="group mb-1 flex w-full items-start gap-3 rounded-box px-3 py-2.5 text-left transition-colors hover:bg-base-300/70"
						onclick={() => selectComment(comment.id)}
					>
						<FileText size={16} class="mt-0.5 shrink-0 text-primary/75" />
						<span class="min-w-0 flex-1">
							<span class="block truncate text-sm font-medium">{comment.title}</span>
							<span class="mt-0.5 block text-xs text-base-content/50">{comment.updated}</span>
						</span>
					</button>
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
				<button class="btn gap-1.5 btn-ghost btn-sm" type="button" aria-label="Save comment">
					<Save size={15} />
					<span class="hidden sm:inline">Save</span>
				</button>
			</div>
			<div
				class="flex items-center gap-2 border-b border-base-content/10 px-4 py-2 text-xs text-base-content/55"
			>
				<span class="badge badge-ghost badge-sm">Markdown</span>
				<span>Use $...$ or $$...$$ for KaTeX math</span>
			</div>
			<textarea
				class="min-h-80 flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 outline-none placeholder:text-base-content/35"
				oninput={updateContent}
				aria-label="Edit comment in Markdown"
				placeholder="Write a comment in Markdown...">{selectedComment?.content ?? ''}</textarea>
			<div
				class="flex items-center justify-between border-t border-base-content/10 px-4 py-2 text-xs text-base-content/50"
			>
				<span class="flex items-center gap-1.5"><Clock3 size={13} /> Draft template</span>
				<span>{(selectedComment?.content ?? '').length} characters</span>
			</div>
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
			<div class="comment-preview min-h-80 flex-1 overflow-y-auto p-5 text-sm leading-6">
				<!--eslint-disable-next-line svelte/no-at-html-tags-->
				{@html renderedMarkdown}
			</div>
		</section>
	</div>
</div>
