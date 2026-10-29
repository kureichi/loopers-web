import mongoose, { Model, model, Schema, type InferSchemaType } from 'mongoose';

const ballSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	count: {
		type: Number,
		required: true
	},
	updatedAt: {
		type: Date,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}
});

type BallI = InferSchemaType<typeof ballSchema>;
const Ball = (mongoose.models.Ball || model('Ball', ballSchema)) as Model<BallI>;
export default Ball;
