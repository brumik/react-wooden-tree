import { connect } from 'react-redux';
import { Node, TreeData, NodeProps } from '../../components/Node';

const mapStateToProps = ({ treeData }: TreeData, ownProps: NodeProps) => {
    return {...treeData[ownProps.nodeId], parentData: ownProps.parentData};
};

// @ts-ignore
export default connect(mapStateToProps)(Node);
