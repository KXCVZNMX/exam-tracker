<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let error = $state('');
	let pending = $state(false);

	async function signInWithGitHub() {
		pending = true;
		error = '';
		const result = await authClient.signIn.social({ provider: 'github', callbackURL: '/subjects' });
		if (result.error) error = result.error.message ?? 'Unable to authenticate';
		if (result.error) pending = false;
	}
</script>

<svelte:head><title>Sign in | Exam Tracker</title></svelte:head>

<main class="flex min-h-screen items-center justify-center px-4">
	<div class="card bg-base-200 w-full max-w-md p-8 text-center shadow-xl">
		<h1 class="mb-2 text-3xl font-bold">Welcome to Exam Tracker</h1>
		<p class="text-base-content/60 mb-6">Sign in with your GitHub account to continue.</p>
		{#if error}<p class="text-error mb-3 text-sm">{error}</p>{/if}
		<button class="btn btn-primary w-full" disabled={pending} onclick={signInWithGitHub}>{pending ? 'Redirecting...' : 'Continue with GitHub'}</button>
	</div>
</main>
