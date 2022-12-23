export interface IRecipe {
    name: string;
    creator: string;
    ingredients: string[];
    cookingTime: number;
    difficulityLevel: string;
}

export interface IRecipeQuery {
    name?: string;
    creator?: string;
    difficulityLevel?: string;

    /* type: "any" is neccesary in order to allow using the "+" operator inside the
    aggregation in case that the query recieve numeric string such as : '1' */
    maxCookingTime?: number | any;
    minCookingTime?: number | any;
    page?: number | any;
    itemsPerPage?: number | any;
}
