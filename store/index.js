import {applyMiddleware, createStore} from "redux";
import {reducer} from "./reducers";
import {createWrapper} from "next-redux-wrapper";
import thunk from "redux-thunk";

const makeStore = (context) => createStore(reducer, applyMiddleware(thunk));

export const wrapper = createWrapper(makeStore, {debug: true});