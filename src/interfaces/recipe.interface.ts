export interface IRecipe {
    name: string;
    creator: string;
    ingredients: string;
    cookingTime: string;
    difficulityLevel: string;
}

export interface IRecipeQuery {
    name?: string;
    creator?: string;
    // todos:
    // change cooking time to number\arr of numbers [hrs,mins]
    // maxCookingTime?: string;
    // minCookingTime?: string;
    // change ingredients to string[]
    // maxIngredientsAmount:number;
    // minIngredientsAmount:number;

    difficulityLevel?: string;
}
