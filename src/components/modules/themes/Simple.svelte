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
			<form action="?/push" class="flex flex-1" method="post" use:enhance>
				<Button class="w-full" disabled={isClaimed}>{isClaimed ? 'Done' : 'Push'}</Button>
			</form>
			<form action="?/signOut" class="flex" method="post" use:enhance>
				<Button
					class="flex aspect-square items-center justify-center bg-neutral-800! p-0! text-center text-white"
					><i class="ph-md ph-sign-out-bold"></i></Button
				>
			</form>
		</div>
	</div>
</Wrapper>
