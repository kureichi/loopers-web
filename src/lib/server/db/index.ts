import mongoose from 'mongoose';
import { MONGODB_CONNECTION_URI, DB_NAME } from '$app/env/private';

mongoose.connect(MONGODB_CONNECTION_URI);

export const db = mongoose.connection;

export function getClient() {
	return mongoose.connection.getClient().db(DB_NAME);
}
