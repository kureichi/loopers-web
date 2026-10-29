import { auth } from '#lib/server/auth.ts';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	signInSocial: async (event) => {
		const formData = await event.request.formData();
		const provider = formData.get('provider')?.toString() ?? 'github';
		const callbackURL = formData.get('callbackURL')?.toString() ?? '/demo/better-auth';

		const result = await auth.api.signInSocial({
			body: {
				provider: provider as 'github',
				callbackURL
			}
		});

		if (result.url) {
			return redirect(302, result.url, { external: true });
		}
		return fail(400, { message: 'Social sign-in failed' });
	}
};
