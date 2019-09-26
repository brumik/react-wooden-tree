import { combineReducers } from 'redux';
import { treeDataReducer as treeData } from '../../../../src/index';

export const combinedReducers = combineReducers({ treeData });

export default combinedReducers;
