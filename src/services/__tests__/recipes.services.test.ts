import { IRecipe } from '../../interfaces';
import { RecipeModel } from '../../models';
import { SYSTEM_REQ_ID } from '../../utils';
import {
    findRecipeByName,
    findAllRecipe,
    filterRecipes,
    createRecipe,
    deleteRecipe,
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
        recipeId = resultRecipe?._id;

        expect(resultRecipe).toBeDefined();
        expect(resultRecipe).toHaveProperty('_id');
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
        const query = {
            difficultyLevel: 'hard',
        };

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
});
