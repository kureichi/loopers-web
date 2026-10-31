import Subscription from '#lib/server/db/models/subscription.ts';
import webpush from 'web-push';
import { PUBLIC_VAPID_KEY } from '$app/env/public';
import { PRIVATE_VAPID_KEY } from '$app/env/private';
import Ball from '#lib/server/db/models/ball.ts';
import { isYesterday } from '#lib/utils.ts';

webpush.setVapidDetails('mailto:anda@domain.com', PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY);

export async function GET() {
	const subscriptions = await Subscription.find({});

	if (subscriptions.length == 0) {
		return Response.json({ error: 'Belum ada user yang terdaftar!' }, { status: 400 });
	}

	const payload = JSON.stringify({
		title: "You haven't push yet on this day",
		body: 'Lets push before you late!'
	});

	for (const subscription of subscriptions) {
		try {
			const ball = await Ball.findOne({ userId: subscription.userId });
			if (!ball) return;

			const isClaimed = !isYesterday(ball.updatedAt, new Date());

			if (!isClaimed) {
				await webpush.sendNotification(JSON.parse(subscription.subscription), payload);
			}
		} catch (err) {
			console.warn(err);
		}
	}

	return Response.json({ success: true });
}
