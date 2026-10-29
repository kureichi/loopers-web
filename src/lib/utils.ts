export function isYesterday(date1: Date, date2: Date) {
	const date1MiddleNight = date1.setHours(0, 0, 0, 0);
	const date2MiddleNight = date2.setHours(0, 0, 0, 0);
	return date1MiddleNight < date2MiddleNight;
}
