import { connect } from 'react-redux';
import { NodeProps, TreeDataType, Node } from 'react-wooden-tree';

const mapStateToProps = ({ treeData }: TreeDataType, ownProps: NodeProps) => {
    return {...treeData[ownProps.nodeId]};
};

export const ConnectedNode = connect(mapStateToProps)(Node);
