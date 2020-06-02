// reducers/people.js
import {ADD_Favorite, DELETE_Favorite} from '../constant';

const initialState={Favorite: []}

export default function peopleReducer(state=initialState, action) {
    console.log(action.movie)
    switch(action.type) {

        case ADD_Favorite:
            return {
                Favorite: [...state.Favorite, action.movie],
            };
        case DELETE_Favorite:
            return {
                Favorite: state.Favorite.filter(p => p.item.id!==action.movie.id),
            };
        default:
            return state;
    }
}