import { RecipeModel } from '../models/recipe.model';
import { IRecipe, IRecipeQuery } from '../interfaces/recipe.interface';

export const findRecipeByName = async (recipeName: string) => {
    const recipe = await RecipeModel.findOne({
        name: recipeName,
    }).exec();

    return recipe;
};

export const findAllRecipe = async () => {
    return await RecipeModel.find({});
};

export const createRecipe = async (recipe: IRecipe) => {
    // fix this when you create existing recipe error
    const result = await new RecipeModel(recipe).save().catch((err: Error) => {
        console.log(err);
    });

    return result;
};

export const filterRecipes = async (query: IRecipeQuery) => {
    const { name, creator, difficulityLevel } = query;

    const filteredRecipes = await RecipeModel.aggregate([
        {
            $match: {
                ...(name !== undefined && {
                    name: {
                        $regex: name,
                        $options: 'i',
                    },
                }),
                ...(creator !== undefined && {
                    creator: creator,
                }),
                ...(difficulityLevel !== undefined && {
                    difficulityLevel: difficulityLevel,
                }),
            },
        },
        {
            $project: {
                recipeName: '$name', // destruction
                ingredients: 1,
                cookingTime: 1,
                difficulityLevel: 1,
            },
        },
    ]);

    return filteredRecipes;
};

export const deleteRecipe = async function (recipeName: string) {
    const { deletedCount } = await RecipeModel.deleteOne({
        name: recipeName,
    });

    return deletedCount === 1;
    // supposed to return "true"
};
