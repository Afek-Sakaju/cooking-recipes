export interface IRecipe {
    name: string;
    creator: string;
    ingredients: string;
    cookingTime: number;
    difficulityLevel: string;
}

export interface IRecipeQuery {
    name?: string;
    creator?: string;
    difficulityLevel?: string;
    maxCookingTime?: number;
    minCookingTime?: number;
    // todos:
    // change cooking time to number\arr of numbers [hrs,mins]
    // change ingredients to string[]
    // maxIngredientsAmount:number;
    // minIngredientsAmount:number;
}
