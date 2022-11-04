import { RecipeModel } from '../models/recipe.model';
import { IRecipe, IRecipeQuery } from '../interfaces/recipe.interface';
import logger from '../utils/logger';

export const findRecipeByName = async (
    recipeName: string,
    requestId: string
) => {
    logger.verbose(requestId, 'Running request to get recipe by name from DB');

    const recipe = await RecipeModel.findOne({
        name: recipeName,
    }).exec();

    return recipe;
};

export const findAllRecipe = async (requestId: string) => {
    logger.verbose(requestId, 'Running request to get all recipes from DB');

    return await RecipeModel.find({});
};

export const createRecipe = async (recipe: IRecipe, requestId: string) => {
    logger.verbose(requestId, 'Running creation request of new recipe from DB');
    // fix this when you create existing recipe error
    const result = await new RecipeModel(recipe).save().catch((err: Error) => {
        logger.error(
            requestId,
            'Error occcured during creation of new recipe',
            { error: err }
        );
    });

    return result;
};

export const filterRecipes = async (query: IRecipeQuery, requestId: string) => {
    const { name, creator, difficulityLevel } = query;

    logger.verbose(
        requestId,
        'Running request to get recipes filtered list from DB'
    );

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

export const deleteRecipe = async function (
    recipeName: string,
    requestId: string
) {
    logger.verbose(requestId, 'Running delete request of recipe from DB');

    const { deletedCount } = await RecipeModel.deleteOne({
        name: recipeName,
    });

    return deletedCount === 1;
};
