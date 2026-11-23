import mongoose, { Model, model, Schema, type InferSchemaType } from 'mongoose';

const schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    history: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

type I = InferSchemaType<typeof schema>;
const SearchHistory = (mongoose.models.SearchHistory || model('SearchHistory', schema)) as Model<I>;
export default SearchHistory;
