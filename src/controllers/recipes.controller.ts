import { Request, Response, NextFunction } from 'express';

import { IRecipe } from '../interfaces/recipe.interface';
import {
    createRecipe,
    findRecipeByName,
    deleteRecipe,
    findAllRecipe,
    filterRecipes,
    updateRecipeData,
} from '../services/recipes.services';
import logger from '../utils/logger';

export const getRecipeByNameCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(req.id, 'Getting recipe by name', {
        recipeName: req.params.recipeName,
    });

    const recipe = await findRecipeByName(req.params.recipeName, req.id);

    logger.info(req.id, 'Recipe getting by name results', { recipe: recipe });

    const status = !recipe ? 400 : 200;

    res.status(status).json(recipe);
};

export const createRecipeCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const recipe: IRecipe = {
        name: req.body.name,
        creator: req.body.creator,
        ingredients: req.body.ingredients,
        cookingTime: req.body.cookingTime,
        difficulityLevel: req.body.difficulityLevel,
    };

    logger.info(req.id, 'Creating new recipe', {
        recipeData: recipe,
    });

    const result = await createRecipe(recipe, req.id);

    logger.info(req.id, 'Recipe creation results', {
        recipeData: recipe,
    });

    res.sendStatus(result ? 201 : 500);
};

export const updateRecipeDataCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const recipeData = {
        name: req.body.name,
        creator: req.body.creator,
        ingredients: req.body.ingredients,
        cookingTime: req.body.cookingTime,
        difficulityLevel: req.body.difficulityLevel,
    } as unknown as IRecipe;

    logger.info(req.id, "Updating recipe's data", {
        newData: recipeData,
    });

    const result = await updateRecipeData(recipeData, req.id);

    logger.info(req.id, "Updating of recipe's data results", {
        recipe: result,
    });

    res.json(result);
};

export const deleteRecipeByNameCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(req.id, 'Deleting recipe by his name', {
        recipeName: req.params.recipeName,
    });

    const result = await deleteRecipe(req.params.recipeName, req.id);

    logger.info(req.id, 'Deleting recipe results', {
        isDeleted: result,
    });

    const status = result ? 200 : 400;

    res.sendStatus(status);
};

export const sendAllRecipesCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(req.id, 'Getting all recipes list');

    const allRecipes = await findAllRecipe(req.id);

    logger.info(req.id, 'Get all recipes list results');

    res.json(allRecipes);
};

export const filteredRecipeListCtrl = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(req.id, 'Getting filtered recipes list by query', {
        query: req.query,
    });

    try {
        const filteredList = await filterRecipes(req.query, req.id);

        logger.info(req.id, 'Get filtered recipes list results', {
            list: filteredList,
        });

        res.json(filteredList);
    } catch (e) {
        next(e);
    }
};
