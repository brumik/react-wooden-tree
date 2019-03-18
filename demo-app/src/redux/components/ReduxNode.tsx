import { connect } from 'react-redux';
import { Node, TreeData, NodeProps } from '../../internal';

const mapStateToProps = ({ treeData }: TreeData, ownProps: NodeProps) => {
    return {...treeData[ownProps.nodeId]};
};

export const ConnectedNode = connect(mapStateToProps)(Node);
