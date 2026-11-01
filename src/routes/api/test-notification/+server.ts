import Subscription from '#lib/server/db/models/subscription.ts';
import { sendNotification } from '#lib/utils/notification/notifyUser.ts';

export const GET = async () => {
	const subscriptions = await Subscription.find({});

	if (subscriptions.length == 0) {
		return Response.json({ error: 'Belum ada user yang terdaftar!' }, { status: 400 });
	}

	for (const subscription of subscriptions) {
		await sendNotification(JSON.parse(subscription.subscription));
	}

	return Response.json({ success: true });
};
