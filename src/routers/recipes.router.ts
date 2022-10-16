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

/**
 * @swagger
 * /recipe/:query:
 *   get:
 *     tags: ['Recipes CRUD routers']
 *     description: get recipes list data by filtering with query parameters
 *     parameters:
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *          description: filter by recipe's name.
 *      - in: query
 *        name: creator
 *        schema:
 *          type: string
 *          description: filter by recipe's creator name.
 *     responses:
 *       200:
 *         description: return the recipes filtered list.
 *         content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                      data:
 *                          type: array
 *                          items:
 *                             $ref: "#/components/schemas/recipe"
 *       500:
 *         description: Server Error
 *
 */
router.get('/', isAuthenticatedMW, filteredRecipeListCtrl); //(by query string)
//to do improve this route by adding pagination and more queries

/**
 * @swagger
 * /recipe/new-recipe:
 *   post:
 *     tags: ['Recipes CRUD routers']
 *     description: create new recipe to the app
 *     requestBody:
 *        description: the recipe's information
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "name", "ingredients","cookingTime" ]
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: "steak-angos"
 *                      creator:
 *                          type: string
 *                          example: "arnold-schwarzeneggerr"
 *                      ingredients:
 *                          type: string
 *                          example: "angos-meat, olive-oil, salt, black-pepper"
 *                      cookingTime:
 *                          type: string
 *                          example: "01:45"
 *                      difficulityLevel:
 *                          type: string
 *                          example: "easy"
 *     responses:
 *       200:
 *         description: Returns the created recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/recipe"
 *       400:
 *         description: return error message, can't continue the recipe creation
 *
 */
router.post('/new-recipe', isAuthenticatedMW, createRecipeCtrl);

router
    .route('/:recipeName')
    .get(getRecipeByNameCtrl)
    .delete(isAuthenticatedMW, deleteRecipeByNameCtrl);

export default router;
