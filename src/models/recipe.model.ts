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
            type: String,
            required: [true, 'missing ingredients to the recipe'],
        }, //todo : change to array of strings (string[])
        cookingTime: {
            type: String,
            required: [true, 'you forgot to mention the cooking time!'],
        },
        difficulityLevel: { type: String, default: 'unknown' },
    },
    { timestamps: true }
);

export const RecipeModel = mongoose.model('recipe', recipeSchema);
