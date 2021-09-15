import {_api} from "./api"

export const loginEndpoint = (data) => _api.post("/auth/login",data);
export const logoutEndpoint = () => _api.get("/auth/logout");
export const verifyUser = (data) => _api.post("/auth/verifyUser",data);
export const signupEndpoint = (data) => _api.post("/auth/signup",data);
export const createRecipeEndpoint = (data) => _api.post("/recipe/create",data);
export const upload = (data) => _api.post("/upload",data);
export const findRecipe = (data) => _api.post("/recipe/findRecipe",data);
export const deleteRecipe = (data) => _api.post("/recipe/deleteRecipe",data);
export const addFavoriteRecipe = (data) => _api.post("/users/addFavoriteRecipe",data);
export const removeFavoriteRecipe = (data) => _api.post("/users/removeFavoriteRecipe",data);
export const browseRecipes = (data) => _api.post("/recipe/findRecipes",data);
export const browseFavorites = (data) => _api.post("/recipe/findFavorites",data);
export const browseMyRecipes = (data) => _api.post("/recipe/findMyRecipes",data);