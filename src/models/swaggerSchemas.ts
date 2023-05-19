import m2s from 'mongoose-to-swagger';

import { RecipeModel } from './recipe.model';
import { UserModel } from './user.model';

const schemas = {
    recipe: m2s(RecipeModel),
    user: m2s(UserModel),
};

export default schemas;
