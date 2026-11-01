import Subscription from '#lib/server/db/models/subscription.ts';
import Ball from '#lib/server/db/models/ball.ts';
import { sendNotification } from '#lib/utils/notification/notifyUser.ts';
import { isYesterday } from '#lib/utils.ts';

export async function GET() {
	const balls = await Ball.find({});

	if (balls.length == 0) {
		return Response.json({ error: 'Belum ada user yang terdaftar!' }, { status: 400 });
	}

	let userNotified = 0;
	let browserNotified = 0;

	for (const ball of balls) {
		try {
			const isClaimed = !isYesterday(ball.updatedAt, new Date());

			if (!isClaimed) {
				userNotified++;

				const subscriptions = await Subscription.find({ userId: ball.userId });

				for (const subscription of subscriptions) {
					browserNotified++;
					await sendNotification(JSON.parse(subscription.subscription));
				}
			}
		} catch (err) {
			console.warn(err);
		}
	}

	return Response.json({
		success: true,
		user_notified: userNotified,
		browser_notified: browserNotified
	});
}
