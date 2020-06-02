import {ADD_Favorite, DELETE_Favorite} from '../constant';

export function addFavorite(movie) {
    console.log('add')
    console.log(movie)
    return {
        type: ADD_Favorite,
        movie: movie,
    };
}

export function deleteFavorite(movie) {
    return {
        type: DELETE_Favorite,
        movie: movie,
    };
}