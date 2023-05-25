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

        expect(resultRecipes.length).toBe(0);
        expect(resultRecipes).toHaveProperty('_id');
        expect(resultRecipes.name).toBe(testRecipe.name);
        expect(resultRecipes.ingredients).toEqual(testRecipe.ingredients);
        expect(resultRecipes.cookingTime).toBe(testRecipe.cookingTime);
        expect(resultRecipes.difficultyLevel).toBe(testRecipe.difficultyLevel);
        expect(resultRecipes.creator).toBe(null);
    });
});
