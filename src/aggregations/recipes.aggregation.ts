import mongoose from 'mongoose';

import { IRecipeQuery } from '../interfaces';

const ObjectId = (id) => new mongoose.Types.ObjectId(id);

export function filterRecipesAggregation({
    name,
    creator,
    difficultyLevel,
    maxCookingTime,
    minCookingTime,
    page,
    itemsPerPage,
}: IRecipeQuery) {
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
                    creator: ObjectId(creator),
                }),
                ...(difficultyLevel !== undefined && {
                    difficultyLevel: difficultyLevel,
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
        { $unwind: '$creatorData' },
        {
            $project: {
                _id: 0,
                name: 1,
                ingredients: 1,
                cookingTime: 1,
                difficultyLevel: 1,
                creator: '$creatorData.fullName',
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
