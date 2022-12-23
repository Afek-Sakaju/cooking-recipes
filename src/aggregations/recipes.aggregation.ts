import { IRecipeQuery } from '../interfaces/recipe.interface';

export function filterRecipesAggregation(query: IRecipeQuery) {
    const { name, creator, difficulityLevel, maxCookingTime, minCookingTime } =
        query;

    return [
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
                ...((minCookingTime !== undefined ||
                    maxCookingTime !== undefined) && {
                    cookingTime: {
                        ...(minCookingTime !== undefined && {
                            $gte: +minCookingTime,
                        }),
                        ...(maxCookingTime !== undefined && {
                            $lte: +maxCookingTime,
                        }),
                    },
                }),
            },
        },
        {
            $project: {
                _id: 0,
                recipeName: '$name',
                ingredients: 1,
                cookingTime: 1,
                difficulityLevel: 1,
            },
        },
    ];
}
