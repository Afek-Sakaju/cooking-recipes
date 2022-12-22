import { IRecipeQuery } from '../interfaces/recipe.interface';

export function filterRecipesAggregation(query: IRecipeQuery) {
    const { name, creator, difficulityLevel } = query;

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
                    creator,
                }),
                ...(difficulityLevel !== undefined && {
                    difficulityLevel,
                }),
            },
        },
        {
            $project: {
                recipeName: '$name',
                ingredients: 1,
                cookingTime: 1,
                difficulityLevel: 1,
            },
        },
    ];
}
