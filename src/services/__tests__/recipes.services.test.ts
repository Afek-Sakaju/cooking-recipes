import { IRecipe } from '../../interfaces';
import { RecipeModel } from '../../models';
import { SYSTEM_REQ_ID } from '../../utils';
import {
    findRecipeByName,
    findAllRecipe,
    filterRecipes,
    createRecipe,
    deleteRecipe,
    updateRecipeData,
} from '../recipes.services';

describe('recipes services tests', () => {
    const testRecipe = {
        name: 'cheesyBread',
        ingredients: ['salt', 'pepper', 'cheese', 'ghee-butter', 'bread'],
        cookingTime: 20,
        difficultyLevel: 'easy',
    } as unknown as IRecipe;

    let recipeId: string;

    beforeAll(async () => {
        const recipeDoc = new RecipeModel(testRecipe);
        const resultRecipe = (await recipeDoc.save()) as unknown as IRecipe;
        recipeId = resultRecipe._id;

        expect(resultRecipe).toBeDefined();
        expect(resultRecipe).toHaveProperty('_id');
        expect(resultRecipe).toHaveProperty('name');
        expect(resultRecipe).toHaveProperty('ingredients');
        expect(resultRecipe).toHaveProperty('cookingTime');
        expect(resultRecipe).toHaveProperty('difficultyLevel');
        expect(resultRecipe).toHaveProperty('creator');
    });

    test('service findRecipeByName returns desired recipe by his name', async () => {
        const resultRecipe = (await findRecipeByName(
            testRecipe.name,
            SYSTEM_REQ_ID
        )) as unknown as IRecipe;

        expect(resultRecipe).toBeDefined();
        expect(resultRecipe).toHaveProperty('_id');
        expect(resultRecipe.name).toBe(testRecipe.name);
        expect(resultRecipe.ingredients).toEqual(testRecipe.ingredients);
        expect(resultRecipe.cookingTime).toBe(testRecipe.cookingTime);
        expect(resultRecipe.difficultyLevel).toBe(testRecipe.difficultyLevel);
        expect(resultRecipe.creator).toBe(null);
    });

    test('service findAllRecipe returns array with all recipes list', async () => {
        const resultRecipes = (await findAllRecipe(
            SYSTEM_REQ_ID
        )) as unknown as Array<IRecipe>;
        const exampleRecipe = resultRecipes?.[0];

        expect(resultRecipes).toBeDefined();
        // There are 5 recipes created from migration file and 1 at the beginning of the tests
        expect(resultRecipes.length).toBe(6);
        expect(exampleRecipe).toHaveProperty('_id');
        expect(exampleRecipe).toHaveProperty('name');
        expect(exampleRecipe).toHaveProperty('ingredients');
        expect(exampleRecipe).toHaveProperty('cookingTime');
        expect(exampleRecipe).toHaveProperty('difficultyLevel');
        expect(exampleRecipe).toHaveProperty('creator');
    });

    test('service filterRecipes returns array with the filtered recipes list', async () => {
        const query = { difficultyLevel: 'hard' };

        const [[response]] = (await filterRecipes(query, SYSTEM_REQ_ID)) as any;
        expect(response).toBeDefined();

        const { data: resultRecipes } = response;
        const exampleRecipe = resultRecipes?.[0];

        expect(resultRecipes).toBeDefined();
        // There are 2 recipes that match the query params
        expect(resultRecipes.length).toBe(2);
        expect(exampleRecipe).toHaveProperty('name');
        expect(exampleRecipe).toHaveProperty('ingredients');
        expect(exampleRecipe).toHaveProperty('cookingTime');
        expect(exampleRecipe.difficultyLevel).toBe(query.difficultyLevel);
        expect(exampleRecipe).toHaveProperty('creator');
    });

    test('service createRecipe create new recipe, than delete him by deleteRecipe', async () => {
        const recipeData = {
            name: 'potato-chips',
            ingredients: ['potato', 'olive-oil', 'salt'],
            cookingTime: 30,
            difficultyLevel: 'medium',
        } as IRecipe;

        const resultRecipe = (await createRecipe(
            recipeData,
            SYSTEM_REQ_ID
        )) as unknown as IRecipe;

        expect(resultRecipe).toBeDefined();
        expect(resultRecipe).toHaveProperty('_id');
        expect(resultRecipe.name).toBe(recipeData.name);
        expect(resultRecipe.ingredients).toEqual(recipeData.ingredients);
        expect(resultRecipe.cookingTime).toBe(recipeData.cookingTime);
        expect(resultRecipe.difficultyLevel).toBe(recipeData.difficultyLevel);
        expect(resultRecipe.creator).toBe(null);

        const deleteResponse = (await deleteRecipe(
            recipeData.name,
            SYSTEM_REQ_ID
        )) as unknown as IRecipe;

        expect(deleteResponse).toBeTruthy();

        const getRecipeResponse = await RecipeModel.findOne({
            name: recipeData.name,
        });

        expect(getRecipeResponse).toBe(undefined || null);
    });

    test('service updateRecipeData updates recipe and returns its updated data', async () => {
        const recipeData = {
            name: 'sweet-potato-chips',
            ingredients: ['sweet-potato', 'canola-oil', 'pepper'],
            cookingTime: 25,
            difficultyLevel: 'medium',
        } as IRecipe;

        const updateRes1 = (await updateRecipeData(
            recipeData,
            SYSTEM_REQ_ID
        )) as unknown as IRecipe;

        expect(updateRes1).toBeDefined();
        expect(updateRes1._id).toBe(recipeId);
        expect(updateRes1.name).toBe(recipeData.name);
        expect(updateRes1.ingredients).toEqual(recipeData.ingredients);
        expect(updateRes1.cookingTime).toBe(recipeData.cookingTime);
        expect(updateRes1.difficultyLevel).toBe(recipeData.difficultyLevel);
        expect(updateRes1.creator).toBe(null);

        // This test written to bring the testRecipe data back to the initial state
        const updateRes2 = (await updateRecipeData(
            testRecipe,
            SYSTEM_REQ_ID
        )) as unknown as IRecipe;
        expect(updateRes2).toBeDefined();
    });
});
