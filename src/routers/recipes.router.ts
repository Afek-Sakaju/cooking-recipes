import express, { Request, Response, NextFunction } from 'express';

import {
    getRecipeByNameCtrl,
    deleteRecipeByNameCtrl,
    sendAllRecipesCtrl,
    filteredRecipeListCtrl,
    createRecipeCtrl,
    updateRecipeDataCtrl,
} from '../controllers/recipes.controller';
import { isAuthenticatedMW } from '../middleware';
import { logger } from '../utils';

const router = express.Router();

router.use((req: Request, res: Response, next: NextFunction) => {
    logger.debug(req.id, 'Call to API', {
        method: req.method,
        originalUrl: req.originalUrl,
        body: req.body,
    });

    next();
});

/**
 * @swagger
 * /recipe/all:
 *   get:
 *     tags: ['Recipes CRUD routers']
 *     description: Get all recipes list
 *     responses:
 *       200:
 *         description: Found all recipes successfully, returns the recipes list
 *         content:
 *           application/json:
 *               schema:
 *                  type: array
 *                  items:
 *                      $ref: "#/components/schemas/recipe"
 *       500:
 *         description: Server error
 *
 */
router.get('/all', sendAllRecipesCtrl);

/**
 * @swagger
 * /recipe/:
 *   get:
 *     tags: ['Recipes CRUD routers']
 *     description: Get recipes filtered list using query parameters to filter
 *     security:
 *        cookieAuth:
 *          - connect.sid
 *     parameters:
 *      - in: query
 *        name: name
 *        schema:
 *          type: string
 *          description: Filter by recipe's name.
 *      - in: query
 *        name: creator
 *        schema:
 *          type: string
 *          description: Filter by recipe's creator id.
 *      - in: query
 *        name: difficultyLevel
 *        schema:
 *          type: string
 *          description: Filter by recipe's difficulty level.
 *      - in: query
 *        name: maxCookingTime
 *        schema:
 *          type: number
 *          description: Filter by recipe's maximum cooking time.
 *      - in: query
 *        name: minCookingTime
 *        schema:
 *          type: number
 *          description: Filter by recipe's minimum cooking time.
 *      - in: query
 *        name: page
 *        required: true
 *        schema:
 *          type: number
 *          minimum: 1
 *        description: Get results from specific page
 *      - in: query
 *        name: itemsPerPage
 *        required: true
 *        schema:
 *          type: number
 *          minimum: 1
 *          maximum: 100
 *        description: Modify results count of each page
 *     responses:
 *       200:
 *         description: Found filtered list successfully, returns the filtered list
 *         content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                      data:
 *                          type: array
 *                          items:
 *                             $ref: "#/components/schemas/recipe"
 *       401:
 *         description: Unauthenticated user
 *       500:
 *         description: Server error
 *
 */
router.get('/', isAuthenticatedMW, filteredRecipeListCtrl);

/**
 * @swagger
 * /recipe/new-recipe:
 *   post:
 *     tags: ['Recipes CRUD routers']
 *     description: Create new recipe
 *     security:
 *        cookieAuth:
 *          - connect.sid
 *     requestBody:
 *        description: The recipe's data
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
 *                          example: "632ef3ad40c4dca948a003fc"
 *                      ingredients:
 *                          type: array
 *                          example: ["angos-meat", "olive-oil", "salt", "black-pepper"]
 *                      cookingTime:
 *                          type: number
 *                          example: "45"
 *                      difficultyLevel:
 *                          type: string
 *                          example: "easy"
 *     responses:
 *       201:
 *         description: Created recipe successfully, returns the created recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/recipe"
 *       401:
 *         description: Unauthenticated user
 *       500:
 *         description: Server error
 *
 */
router.post('/new-recipe', isAuthenticatedMW, createRecipeCtrl);

/**
 * @swagger
 * /recipe/find/{recipeName}:
 *   get:
 *     tags: ['Recipes CRUD routers']
 *     description: Get recipe by its name
 *     parameters:
 *      - in: path
 *        name: recipeName
 *        required: true
 *        type: string
 *        description: The recipe's name
 *     responses:
 *       200:
 *         description: Recipe found successfully, returns recipe
 *         content:
 *           application/json:
 *               schema:
 *                      $ref: "#/components/schemas/recipe"
 *       404:
 *         description: Recipe not found
 *       500:
 *         description: Server error
 *
 */
router.get('/find/:recipeName', getRecipeByNameCtrl);

/**
 * @swagger
 * /recipe/update:
 *   put:
 *     tags: ['Recipes CRUD routers']
 *     description: Update recipe's data by name
 *     security:
 *        cookieAuth:
 *          - connect.sid
 *     requestBody:
 *        description: The user's data
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "name" ]
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: "steak-angos"
 *                      creator:
 *                          type: string
 *                          example: "632ef3ad40c4dca948a003fc"
 *                      ingredients:
 *                          type: array
 *                          items:
 *                              type: string
 *                          example: ["angos-meat", "olive-oil", "salt", "black-pepper"]
 *                      cookingTime:
 *                          type: number
 *                          example: 15
 *                      difficultyLevel:
 *                          type: string
 *                          example: "easy"
 *     responses:
 *       200:
 *         description: Updated recipe data successfully, returns updated data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/recipe"
 *       400:
 *         description: Update failed
 *       401:
 *         description: Unauthenticated user
 *
 */
router.put('/update', isAuthenticatedMW, updateRecipeDataCtrl);

/**
 * @swagger
 * /recipe/{recipeName}:
 *   delete:
 *     tags: ['Recipes CRUD routers']
 *     description: Delete recipe data by its name
 *     security:
 *        cookieAuth:
 *          - connect.sid
 *     parameters:
 *      - in: path
 *        name: recipeName
 *        required: true
 *        type: string
 *        description: The recipes name.
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *       400:
 *         description: Invalid data provided
 *       401:
 *         description: Unauthenticated user
 *       500:
 *         description: Server error
 *
 */
router.delete('/:recipeName', isAuthenticatedMW, deleteRecipeByNameCtrl);

export default router;
