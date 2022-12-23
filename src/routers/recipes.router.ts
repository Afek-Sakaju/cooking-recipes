import express, { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

import {
    getRecipeByNameCtrl,
    deleteRecipeByNameCtrl,
    sendAllRecipesCtrl,
    filteredRecipeListCtrl,
    createRecipeCtrl,
    updateRecipeDataCtrl,
} from '../controllers/recipes.controller';
import { isAuthenticatedMW } from '../middleware/auth-middleware';

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
 *     description: Get all recipes list data
 *     responses:
 *       200:
 *         description: Returns all recipes list.
 *         content:
 *           application/json:
 *               schema:
 *                  type: array
 *                  items:
 *                      $ref: "#/components/schemas/recipe"
 *       401:
 *         description: Unauthorized user
 *       500:
 *         description: Server Error
 *
 */
router.get('/all', sendAllRecipesCtrl);

/**
 * @swagger
 * /recipe/:
 *   get:
 *     tags: ['Recipes CRUD routers']
 *     description: get recipes list data by filtering with query parameters
 *     security:
 *        cookieAuth:
 *          - connect.sid
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
 *      - in: query
 *        name: difficulityLevel
 *        schema:
 *          type: string
 *          description: filter by recipe's difficulity level.
 *      - in: query
 *        name: maxCookingTime
 *        schema:
 *          type: number
 *          description: filter by recipe's maximum cooking time.
 *      - in: query
 *        name: minCookingTime
 *        schema:
 *          type: number
 *          description: filter by recipe's minimux cooking time.
 *      - in: query
 *        name: page
 *        required: true
 *        schema:
 *          type: integer
 *          minimum: 1
 *        description: Get result from speciefic page
 *      - in: query
 *        name: itemsPerPage
 *        required: true
 *        schema:
 *          type: integer
 *          minimum: 1
 *          maximum: 100
 *        description: Modify results count inside the page
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
router.get('/', filteredRecipeListCtrl);

//router.get('/', isAuthenticatedMW, filteredRecipeListCtrl);

/**
 * @swagger
 * /recipe/new-recipe:
 *   post:
 *     tags: ['Recipes CRUD routers']
 *     description: create new recipe to the app
 *     security:
 *        cookieAuth:
 *          - connect.sid
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
 *                          type: number
 *                          example: "45"
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
 *       401:
 *         description: Unauthorized user
 *       500:
 *         description: Server Error
 *
 */
router.post('/new-recipe', isAuthenticatedMW, createRecipeCtrl);

/**
 * @swagger
 * /recipe/find/{recipeName}:
 *   get:
 *     tags: ['Recipes CRUD routers']
 *     description: get recipe data by his name
 *     parameters:
 *      - in: path
 *        name: recipeName
 *        required: true
 *        type: string
 *        description: The recipes name.
 *     responses:
 *       200:
 *         description: return the recipe's data.
 *         content:
 *           application/json:
 *               schema:
 *                      $ref: "#/components/schemas/recipe"
 *       400:
 *         description: Invalid data provided
 *       500:
 *         description: Server Error
 *
 */
router.get('/find/:recipeName', getRecipeByNameCtrl);

/**
 * @swagger
 * /recipe/update:
 *   put:
 *     tags: ['Recipes CRUD routers']
 *     description: update of recipe's data by name
 *     security:
 *        cookieAuth:
 *          - connect.sid
 *     requestBody:
 *        description: the user information for updating
 *        required: true
 *        content:
 *           application/json:
 *               schema:
 *                  type: object
 *                  required: [ "name" ]
 *                  properties:
 *                      name:
 *                          type: string
 *                          example: "beef-sandwich"
 *                      creator:
 *                          type: string
 *                          example: "harry-mcguiore"
 *                      ingredients:
 *                          type: string
 *                          example: "salt-pepper-meat-bread"
 *                      cookingTime:
 *                          type: number
 *                          example: 15
 *                      difficulityLevel:
 *                          type: string
 *                          example: "easy"
 *     responses:
 *       200:
 *         description: Returns the updated recipe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/recipe"
 *       400:
 *         description: Return message of the error that occured in the updating procces
 *
 */
router.put('/update', isAuthenticatedMW, updateRecipeDataCtrl);

/**
 * @swagger
 * /recipe/{recipeName}:
 *   delete:
 *     tags: ['Recipes CRUD routers']
 *     description: Delete recipe data by his name
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
 *         description: Recipe deleted successfully.
 *       400:
 *         description: Invalid data provided
 *       401:
 *         description: Unauthorized user
 *       500:
 *         description: Server Error
 *
 */
router.delete('/:recipeName', isAuthenticatedMW, deleteRecipeByNameCtrl);

export default router;
