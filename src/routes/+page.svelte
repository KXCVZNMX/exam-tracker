<script lang="ts">
	import vcaa from '$lib/assets/vcaa.svg';
	import { Library } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import type { PageData } from './$types';
	import GithubIcon from '../lib/assets/github.svg';
	import GoogleIcon from '../lib/assets/google.svg';
	import AddSubject from '$lib/components/modals/AddSubject.svelte';

	async function signIn(provider: 'google' | 'github') {
		await authClient.signIn.social({ provider, callbackURL: '/subjects' });
	}

	let { data }: { data: PageData } = $props();

	let showAddSubject = $state(false);
</script>

<svelte:head>
	<title>Exam Tracker</title>
</svelte:head>

<AddSubject bind:show={showAddSubject} />

<div class="relative flex min-h-screen items-center justify-center">
	<img
		src={vcaa}
		alt="vcaa logo"
		class="absolute -z-10 blur-md"
		style="image-rendering: pixelated;"
		width="872"
		height="144"
	/>

	<div class="flex flex-col justify-center gap-5">
		<h1 class="noto-sans-extrabold pb-1 text-8xl">
			<span style="color: #999999"> Exam </span>
			<span style="color: #0099cc"> Tracker </span>
		</h1>

		<h2 class="noto-sans-semibold text-center text-xl" style="color: #aaaaaa">
			Have fun on your exams
		</h2>

		<div class="flex gap-3">
			{#if data.session}
				<button
					class="noto-sans-bold btn grow shadow-neutral-800/50 transition-all duration-300 btn-primary hover:shadow-2xl"
					onclick={() => (showAddSubject = true)}
				>
					Begin Your Pain
				</button>
				<button class="btn" onclick={() => goto(resolve('/(main)/subjects'))}>
					<Library /> Subjects
				</button>
			{:else}
				<button
					class="noto-sans-bold btn grow shadow-neutral-800/50 transition-all duration-300 btn-primary hover:shadow-2xl"
				>
					Go login first →˷→
				</button>
				<div class="dropdown dropdown-end">
					<button
						tabindex="0"
						type="button"
						class="noto-sans-bold btn shadow-neutral-800/50 transition-all duration-300 hover:shadow-2xl"
					>
						Login
					</button>

					<ul
						tabindex="-1"
						class="menu dropdown-content z-10 mt-2 w-48 rounded-box bg-base-200 p-2 shadow-lg"
					>
						<li>
							<button type="button" onclick={() => signIn('google')} aria-label="Login with Google">
								<img src={GoogleIcon} alt="Google Logo" height="20" width="20" />
								<span>Google</span>
							</button>
						</li>

						<li>
							<button type="button" onclick={() => signIn('github')} aria-label="Login with GitHub">
								<img src={GithubIcon} alt="GitHub Logo" height="20" width="20" />
								<span>GitHub</span>
							</button>
						</li>
					</ul>
				</div>
			{/if}
		</div>
	</div>
</div>
