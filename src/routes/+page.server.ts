import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '#lib/server/auth.ts';
import Ball from '#lib/server/db/models/ball.ts';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}

	let ball = await Ball.findOne({ userId: event.locals.user.id }).lean();
	if (!ball) {
		const newBall = await Ball.create({
			userId: event.locals.user.id,
			count: 0,
			updatedAt: new Date()
		});

		ball = newBall.toObject();
	}

	return {
		user: event.locals.user,
		ball: {
			...ball,
			_id: ball._id.toString()
		}
	};
};

export const actions: Actions = {
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/login');
	},
	push: async (event) => {
		const ball = await Ball.findOne({ userId: event.locals.user?.id }).lean();
		if (!ball) return redirect(302, '?/signOut');

		await Ball.updateOne(
			{ userId: event.locals.user?.id },
			{
				count: ball?.count + 1,
				updatedAt: new Date()
			}
		);

		return redirect(302, '/');
	}
};
