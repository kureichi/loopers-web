import Subscription from '#lib/server/db/models/subscription.ts';
import type { SubscriptionRequest } from '#lib/types/subscriptionRequest.ts';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = (await request.json()) as SubscriptionRequest;

	const subscription = Subscription.findOne({ userId: data.userId });

	if (!subscription) {
		Subscription.create({
			userId: data.userId,
			subscription: JSON.stringify(data.subscription)
		});
		return Response.json({ success: true });
	}

	return Response.json(
		{ success: false, message: 'You have already subscription' },
		{ status: 400 }
	);
};
