<script lang="ts">
	import vcaa from '$lib/assets/vcaa.svg';
	import { Library } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
</script>

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

		<!-- TODO: Make this a dropdown of login options when the user is not logged in-->
		<div class="flex gap-3">
			<button
				class="noto-sans-bold btn grow shadow-neutral-800/50 transition-all duration-300 btn-primary hover:shadow-2xl"
			>
				Begin Your Pain
			</button>
			<button class="btn" onclick={() => goto(resolve('/(main)/subjects'))}>
				<Library /> Subjects
			</button>
		</div>
	</div>
</div>
