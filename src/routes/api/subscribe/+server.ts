import Subscription from '#lib/server/db/models/subscription.ts';
import type { SubscriptionRequest } from '#lib/types/subscriptionRequest.ts';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = (await request.json()) as SubscriptionRequest;
	const subscriptionString = JSON.stringify(data.subscription);

	const subscription = await Subscription.findOne({ subscription: subscriptionString });

	if (!subscription) {
		Subscription.create({
			userId: data.userId,
			subscription: subscriptionString
		});
		return Response.json({ success: true });
	}

	return Response.json(
		{ success: false, message: 'Subscription already in database.' },
		{ status: 400 }
	);
};
