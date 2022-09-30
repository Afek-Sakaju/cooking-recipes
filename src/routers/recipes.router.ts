import express from 'express';
import {
    getRecipeByNameCtrl,
    deleteRecipeByNameCtrl,
    sendAllRecipesCtrl,
    filteredRecipeListCtrl,
    createRecipeCtrl,
} from '../controllers/recipes.controller';
import { isAuthenticatedMW } from '../middleware/auth-middleware';

const router = express.Router();

router.get('/all', isAuthenticatedMW, sendAllRecipesCtrl);

router.get('/', isAuthenticatedMW, filteredRecipeListCtrl); //(by query string)

router.post('/new-recipe', isAuthenticatedMW, createRecipeCtrl);

router
    .route('/:recipeName')
    .get(getRecipeByNameCtrl)
    .delete(isAuthenticatedMW, deleteRecipeByNameCtrl);

export default router;
