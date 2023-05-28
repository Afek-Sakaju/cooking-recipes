import { Request, Response, NextFunction } from 'express';

import { IRecipe } from '../interfaces';
import {
    createRecipe,
    findRecipeByName,
    deleteRecipe,
    findAllRecipe,
    filterRecipes,
    updateRecipeData,
} from '../services/recipes.services';
import { logger } from '../utils';

export const getRecipeByNameCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.info(req.id, 'Getting recipe by name', {
        recipeName: req.params.recipeName,
    });

    const result = await findRecipeByName(req.params.recipeName, req.id);

    logger.info(req.id, 'Recipe getting by name results', {
        recipe: result,
    });
    res.status(result ? 200 : 404).json(result);
};

export const createRecipeCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const recipe = {
        name: req.body.name,
        creator: req.body.creator,
        ingredients: req.body.ingredients,
        cookingTime: req.body.cookingTime,
        difficultyLevel: req.body.difficultyLevel,
    } as unknown as IRecipe;

    logger.info(req.id, 'Creating new recipe', {
        recipeData: recipe,
    });

    const result = await createRecipe(recipe, req.id);

    logger.info(req.id, 'Recipe creation results', {
        recipeData: recipe,
    });
    res.status(result ? 201 : 500).json(result);
};

export const updateRecipeDataCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const recipeData = {
        name: req.body.name,
        creator: req.body.creator,
        ingredients: req.body.ingredients,
        cookingTime: req.body.cookingTime,
        difficultyLevel: req.body.difficultyLevel,
    } as unknown as IRecipe;

    logger.info(req.id, "Updating recipe's data", {
        newData: recipeData,
    });

    const result = await updateRecipeData(recipeData, req.id);

    logger.info(req.id, "Updating of recipe's data results", {
        recipe: result,
    });
    res.status(result ? 200 : 400).json(result);
};

export const deleteRecipeByNameCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.info(req.id, 'Deleting recipe by his name', {
        recipeName: req.params.recipeName,
    });

    const isDeleted: boolean = await deleteRecipe(
        req.params.recipeName,
        req.id
    );

    logger.info(req.id, 'Deleting recipe results', {
        isDeleted,
    });
    res.sendStatus(isDeleted ? 200 : 400);
};

export const sendAllRecipesCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.info(req.id, 'Getting all recipes list');

    const result = await findAllRecipe(req.id);

    logger.info(req.id, 'Get all recipes list results');
    res.json(result);
};

export const filteredRecipeListCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.info(req.id, 'Getting filtered recipes list by query', {
        query: req.query,
    });

    try {
        const result = await filterRecipes(req.query, req.id);

        logger.info(req.id, 'Get filtered recipes list results', {
            list: result,
        });

        res.status(200).json(result);
    } catch (e) {
        res.sendStatus(500);
    }
};
