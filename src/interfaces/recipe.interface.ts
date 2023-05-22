export interface IRecipe {
    name: string;
    creator: string;
    ingredients: string[];
    cookingTime: number;
    difficultyLevel: string;
}

export interface IRecipeQuery {
    name?: string;
    creator?: string;
    difficultyLevel?: string;

    /* type: "any" is necessary in order to allow using the "+" operator inside the
    aggregation in case that the query receive numeric string such as : '1' */
    maxCookingTime?: number | any;
    minCookingTime?: number | any;
    page?: number | any;
    itemsPerPage?: number | any;
}
