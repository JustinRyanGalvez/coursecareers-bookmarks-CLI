//Can import two ways
import * as SDK from '../src/lib/sdk.js'; // Needs SDK. in front of each function name
// import { addFavorite, getFavorite, replaceFavorite, deleteFavorite; getFavorites } from '../src/lib/sdk.js'; //Does not need SDK in function name
const newFavId = await SDK.addFavorite('example', 'example');
console.log(newFavId);
let result = await SDK.getFavorite(newFavId);
console.log(result);
result.name = 'test-new';
await SDK.replaceFavorite(result.id, result);
const fav = await SDK.getFavorite(result.id);
console.log('updated:', fav);
await SDK.deleteFavorite(newFavId);
result = await SDK.getFavorite(newFavId);
console.log(result);
//# sourceMappingURL=sdk.js.map