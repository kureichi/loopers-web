<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '../../components/ui/Button.svelte';
	import Wrapper from '../../components/ui/Wrapper.svelte';
</script>

<Wrapper>
	<div class="flex w-100 flex-col gap-4">
		<div>
			<h1 class="text-3xl font-medium">Hellow!</h1>
			<p class="text-sm text-text-secondary">Log-in with your github account to continue.</p>
		</div>

		<form method="post" action="?/signInSocial" use:enhance>
			<input type="hidden" name="provider" value="github" />
			<input type="hidden" name="callbackURL" value="/" />
			<Button class="w-full">Continue with GitHub</Button>
		</form>
	</div>
</Wrapper>
