import { connect } from 'react-redux';
import { Tree, TreeProps, TreeData } from '../../internal';

const mapStateToProps = ({ treeData }: TreeData) => {
    return {data: {...treeData}, isRedux: true};
};

export const ReduxTree = connect(mapStateToProps)(
    Tree as React.ComponentClass<TreeProps, {}>
) as React.ComponentClass<TreeProps, {}>;
