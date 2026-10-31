import mongoose, { Model, model, Schema, type InferSchemaType } from 'mongoose';

const schema = new Schema({
	userId: {
		type: String,
		required: true
	},
	subscription: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

type I = InferSchemaType<typeof schema>;
const Subscription = (mongoose.models.Subscription || model('Subscription', schema)) as Model<I>;
export default Subscription;
