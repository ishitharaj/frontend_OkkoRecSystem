import axios from "axios";
import { filmsActions } from "../reducers/filmsSlice.js";
console.log("hello")

export const fetchFilms = (page, searchQuery) => async (dispatch, getState) => {
  const filmList = getState().films.films;
  dispatch(filmsActions.filmsFetch());
  if (searchQuery.startsWith("-")) {
    const response = await axios.get(
      `http://127.0.0.1:8080/get_recommendation?user_id=${searchQuery.substring(1)}`,
      // `http://127.0.0.1:8080/get_recommendation?user_id=228319880`,
    );
    // const response = await axios.get(
    //   `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}`,
    //   {
    //     params: { s: searchQuery, page },
    //   }
    // );
    console.log(response);
    if (response.data.Response) {
      dispatch(filmsActions.filmsFetchFailure(response.data.Response));
      return;
    }
  };
  if (!searchQuery.startsWith("-")) {
    const response = await axios.get(
      `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}`,
      {
        params: { s: searchQuery, page },
      }
    );
    if (response.data.Error) {
      if (filmList.length === 0) {
        dispatch(filmsActions.filmsFetchFailure(response.data.Error));
        return;
      }
  
      // if we have films in the list, we don't want to show an error
      dispatch(filmsActions.filmsFetchLoaded());
      return;
    }
    dispatch(filmsActions.filmsFetchSuccess(response.data.Search));
    dispatch(filmsActions.filmsTotalResults(response.data.totalResults));
  };
  // const response = await axios.get(
  //   `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}`,
  //   {
  //     params: { s: searchQuery, page },
  //   }
  // );

  // if (response.data.Error) {
  //   if (filmList.length === 0) {
  //     dispatch(filmsActions.filmsFetchFailure(response.data.Error));
  //     return;
  //   }

  //   // if we have films in the list, we don't want to show an error
  //   dispatch(filmsActions.filmsFetchLoaded());
  //   return;
  // }
  // dispatch(filmsActions.filmsFetchSuccess(response.data.Search));
  // dispatch(filmsActions.filmsTotalResults(response.data.totalResults));
};

export const resetFilms = () => (dispatch) => {
  dispatch(filmsActions.filmsDataReset());
};

export const fetchFilmPlot = (id) => async (dispatch) => {
  const response = await axios.get(
    `https://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_KEY}`,
    {
      params: { i: id },
    }
  );
  if (response.data.Error) {
    dispatch(filmsActions.filmsFetchFailure(response.data.Error));
    return;
  }
  dispatch(filmsActions.filmsAddPlot(response.data));
};
