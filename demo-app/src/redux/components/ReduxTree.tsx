import { connect } from 'react-redux';
import { TreeDataType, TreeProps } from '../../components/types';
import { Tree } from '../../components/Tree';

const mapStateToProps = ({ treeData }: TreeDataType) => {
    return {data: {...treeData}};
};

export const ReduxTree = connect(mapStateToProps)(
    Tree as React.ComponentClass<TreeProps, {}>
) as React.ComponentClass<TreeProps, {}>;
