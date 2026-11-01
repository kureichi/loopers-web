<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../../components/ui/Button.svelte';
	import Wrapper from '../../components/ui/Wrapper.svelte';
</script>

<Wrapper>
	<div class="flex h-screen w-full items-center justify-center">
		<div class="flex w-100 flex-col gap-4">
			<div class="flex flex-col gap-10 text-center">
				<h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
				<p class="font-medium text-text-secondary">Log-in with your github account to continue.</p>
			</div>

			<form method="post" action="?/signInSocial" use:enhance>
				<input type="hidden" name="provider" value="github" />
				<input type="hidden" name="callbackURL" value="/" />
				<Button class="w-full">Continue with GitHub</Button>
			</form>
		</div>
	</div>
</Wrapper>
