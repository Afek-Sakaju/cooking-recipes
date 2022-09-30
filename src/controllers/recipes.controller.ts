import { Request, Response, NextFunction } from 'express';

import { IRecipe } from '../interfaces/recipe.interface';
import {
    createRecipe,
    findRecipeByName,
    deleteRecipe,
    findAllRecipe,
    filterRecipes,
} from '../services/recipes.services';

export const getRecipeByNameCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const recipe = await findRecipeByName(req.params.recipeName);

    res.status(200).json(recipe);
};

export const createRecipeCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const recipe: IRecipe = {
        name: req.body.name,
        creator: req.body.creator,
        ingredients: req.body.ingredients,
        cookingTime: req.body.cookingTime,
        difficulityLevel: req.body.difficulityLevel,
    };

    const result = await createRecipe(recipe);

    res.sendStatus(result ? 200 : 400);
};

export const deleteRecipeByNameCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const status = (await deleteRecipe(req.params.recipeName)) ? 200 : 400;

    res.sendStatus(status);
};

export const sendAllRecipesCtrl = async (
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const allRecipes = await findAllRecipe();

    res.json(allRecipes);
};

export const filteredRecipeListCtrl = async (
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const filteredList = await filterRecipes(req.query);

    res.json(filteredList);
};
