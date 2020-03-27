import { connect } from 'react-redux';
import { Tree, TreeDataType } from '../../../../src/index';

const mapStateToProps = ({ treeData }: TreeDataType) => {
    return {data: {...treeData}};
};

export const ReduxTree = connect(mapStateToProps)(Tree);
