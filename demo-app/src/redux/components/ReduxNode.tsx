import { connect } from 'react-redux';
import { NodeProps, TreeDataType } from '../../components/types';
import { Node } from '../../components/Node';

const mapStateToProps = ({ treeData }: TreeDataType, ownProps: NodeProps) => {
    return {...treeData[ownProps.nodeId]};
};

export const ConnectedNode = connect(mapStateToProps)(Node);
