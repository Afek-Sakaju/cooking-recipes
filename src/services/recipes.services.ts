import { RecipeModel } from '../models/recipe.model';
import { IRecipe, IRecipeQuery } from '../interfaces/recipe.interface';
import { filterRecipesAggregation } from '../aggregations/recipes.aggregation';
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
            'Error occurred during creation of new recipe',
            { error: err }
        );
    });

    return result;
};

export const filterRecipes = async (query: IRecipeQuery, requestId: string) => {
    const aggregation = filterRecipesAggregation(query);

    logger.verbose(
        requestId,
        'Running request to get recipes filtered list from DB',
        { aggregation: JSON.stringify(aggregation, null, 4) }
    );

    const result: any = await RecipeModel.aggregate(aggregation);

    return [result];
};

export async function updateRecipeData(
    recipeData: IRecipe,
    requestId: string
): Promise<IRecipe | undefined> {
    logger.verbose(requestId, 'Running request to update recipe data in DB');

    const result: any = await RecipeModel.findOneAndUpdate(
        { name: recipeData.name },
        {
            creator: recipeData.creator,
            ingredients: recipeData.ingredients,
            cookingTime: recipeData.cookingTime,
            difficulityLevel: recipeData.difficulityLevel,
        },
        { new: true, omitUndefined: true, upsert: true }
    );

    return result.toJSON();
}

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
