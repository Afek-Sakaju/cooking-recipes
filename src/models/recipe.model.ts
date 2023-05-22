import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const recipeSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'please provide name to the recipe'],
            unique: true,
        },
        creator: {
            type: mongoose.Types.ObjectId,
            ref: 'users',
            default: null,
        },
        ingredients: {
            type: [String],
            required: [true, 'missing ingredients of the recipe'],
        },
        cookingTime: {
            type: Number,
            min: 0,
            max: 480,
            required: [true, 'missing cooking time in minutes'],
        },
        difficultyLevel: { type: String, default: 'unknown' },
    },
    { timestamps: true }
);

export const RecipeModel = mongoose.model('recipe', recipeSchema);
