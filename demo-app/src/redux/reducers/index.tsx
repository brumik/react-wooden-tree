import { combineReducers } from 'redux';
import { treeDataReducer as treeData } from 'react-wooden-tree';

export const combinedReducers = combineReducers({ treeData });

export default combinedReducers;
