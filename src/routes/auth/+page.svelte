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
	<div class="card w-full max-w-md bg-base-200 p-8 text-center shadow-xl">
		<h1 class="mb-2 text-3xl font-bold">Welcome to Exam Tracker</h1>
		<p class="mb-6 text-base-content/60">Sign in with your GitHub account to continue.</p>
		{#if error}<p class="mb-3 text-sm text-error">{error}</p>{/if}
		<button class="btn w-full btn-primary" disabled={pending} onclick={signInWithGitHub}
			>{pending ? 'Redirecting...' : 'Continue with GitHub'}</button
		>
	</div>
</main>
