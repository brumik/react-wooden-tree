import { connect } from 'react-redux';
import { Node, TreeDataType, NodeProps } from '../../internal';

const mapStateToProps = ({ treeData }: TreeDataType, ownProps: NodeProps) => {
    return {...treeData[ownProps.nodeId]};
};

export const ConnectedNode = connect(mapStateToProps)(Node);
