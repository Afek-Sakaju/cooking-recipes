import { IRecipeQuery } from '../interfaces/recipe.interface';

export function filterRecipesAggregation(query: IRecipeQuery) {
    const {
        name,
        creator,
        difficulityLevel,
        maxCookingTime,
        minCookingTime,
        page,
        itemsPerPage,
    } = query;

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
            $lookup: {
                let: { creatorId: '$creator' },
                from: 'users',
                as: 'creatorData',
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$creatorId'],
                            },
                        },
                    },
                    { $project: { fullName: 1, _id: 0 } },
                ],
            },
        },
        {
            $project: {
                _id: 0,
                name: 1,
                ingredients: 1,
                cookingTime: 1,
                difficulityLevel: 1,
                creator: '$creatorData.fullName',
                //creator data always returns []
            },
        },
        {
            $facet: {
                pagination: [
                    {
                        $group: {
                            _id: null,
                            totalItems: { $sum: 1 },
                        },
                    },
                    {
                        $addFields: {
                            page,
                            itemsPerPage,
                            totalPages: {
                                $divide: ['$totalItems', +itemsPerPage],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            page: 1,
                            totalItems: 1,
                            itemsPerPage: 1,
                            totalPages: { $ceil: '$totalPages' },
                        },
                    },
                ],
                data: [
                    {
                        $skip: (+page - 1) * +itemsPerPage,
                    },
                    {
                        $limit: +itemsPerPage,
                    },
                ] as any,
            },
        },
    ];
}
