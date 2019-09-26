import { connect } from 'react-redux';
import { NodeProps, TreeDataType, Node } from '../../../../src/index';

const mapStateToProps = ({ treeData }: TreeDataType, ownProps: NodeProps) => {
    return {...treeData[ownProps.nodeId]};
};

export const ConnectedNode = connect(mapStateToProps)(Node);
