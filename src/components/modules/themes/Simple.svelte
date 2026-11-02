<script lang="ts">
	import type { User } from 'better-auth';
	import Wrapper from '../../ui/Wrapper.svelte';
	import Button from '../../ui/Button.svelte';
	import { enhance } from '$app/forms';

	interface Props {
		count: number;
		isClaimed: boolean;
		user: User;
	}

	let isHoldClick = $state(false);
	let timeoutWantReset: NodeJS.Timeout | undefined = $state();

	let isWantReset = $state(false);

	$effect(() => {
		if (!isHoldClick) {
			clearTimeout(timeoutWantReset);
			return;
		}

		timeoutWantReset = setTimeout(() => {
			isWantReset = true;
			isHoldClick = false;
		}, 1000);

		return () => {
			clearTimeout(timeoutWantReset);
		};
	});

	let timeoutCancelled: NodeJS.Timeout | undefined = $state();
	$effect(() => {
		if (isWantReset) {
			timeoutCancelled = setTimeout(() => {
				isWantReset = false;
			}, 2000);
			return;
		}

		if (!isWantReset) {
			clearTimeout(timeoutCancelled);
			return;
		}

		return () => {
			clearTimeout(timeoutCancelled);
		};
	});

	$effect(() => {
		if (isWantReset) {
			console.log('User want reset');
		}

		if (!isWantReset) {
			console.log('want reset false');
		}
	});

	$effect(() => {
		console.log(isHoldClick);
	});

	let { count, isClaimed, user }: Props = $props();
</script>

<Wrapper>
	<div class="flex h-screen w-full flex-col items-center justify-center">
		<h1 class="text-4xl font-bold tracking-tight">Hello, {user.name}</h1>
		<div
			class="mt-20 flex h-50 w-50 items-center justify-center rounded-full bg-white text-6xl font-bold text-black"
		>
			{count}
		</div>

		<div class="mt-15 flex w-full max-w-100 gap-1">
			{#if isWantReset}
				<form action="?/reset" class="flex flex-1" method="post" use:enhance>
					<Button class="w-full bg-accent! text-white!">Reset</Button>
				</form>
			{:else}
				<form action="?/push" class="flex flex-1" method="post" use:enhance>
					<Button
						onpointerdown={() => (isHoldClick = true)}
						onpointerup={() => (isHoldClick = false)}
						onpointerleave={() => (isHoldClick = false)}
						class="w-full"
						disabled={isClaimed}>{isClaimed ? 'Done' : 'Push'}</Button
					>
				</form>
			{/if}
			<form action="?/signOut" class="flex" method="post" use:enhance>
				<Button
					class="flex aspect-square items-center justify-center bg-neutral-800! p-0! text-center text-white"
					><i class="ph-md ph-sign-out-bold"></i></Button
				>
			</form>
		</div>
	</div>
</Wrapper>
