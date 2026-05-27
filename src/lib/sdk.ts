import type { Favorite } from "../types.js";

let baseUrl: string;

// Allows for our baseUrl to be exported to main.js
// Better to have a setter than to hard modify exported values
export const setBaseUrl = (url: string) => {
  baseUrl = url;
};

export const getFavorites = async () => {
  const response = await fetch(`${baseUrl}/favorites`);
  const json = await response.json();

  //grabs from postman query - retrieve favorites
  return json.favorites;
};

export const getFavorite = async (id: number) => {
  const response = await fetch(`${baseUrl}/favorites/${id}`);
  const json = await response.json();

  //grabs from postman query - get favorite by id
  return json.favorite;
};

//use name,url for simplicity. Better use for scaling is using a favorite object that you can then pull for all this stuff
export const addFavorite = async (name: string, url: string) => {
  const response = await fetch(`${baseUrl}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, url }),
  });

  const json = await response.json();
  return json.id;
};

export const deleteFavorite = async (id: number) => {
  const response = await fetch(`${baseUrl}/favorites/${id}`, {
    method: "DELETE",
  });

  //response status does not have a body setup in favorites.js hence why we use only the response status
  return response.status;
};

export const replaceFavorite = async (id: number, newFav: Favorite) => {
  const response = await fetch(`${baseUrl}/favorites/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newFav),
  });

  const json = await response.json();
  return json.favorite;
};
