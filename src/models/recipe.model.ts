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
            type: String,
            default: 'anonymous',
        }, //todo : change to id
        ingredients: {
            type: [String],
            required: [true, 'missing ingredients of the recipe'],
        }, //todo : change to array of strings (string[])
        cookingTime: {
            type: Number,
            min: 0,
            max: 480,
            required: [true, 'missing cooking time in minutes'],
        },
        difficulityLevel: { type: String, default: 'unknown' },
    },
    { timestamps: true }
);

export const RecipeModel = mongoose.model('recipe', recipeSchema);
