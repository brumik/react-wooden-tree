import { TreeData } from './components/Node';

function generate_object(size: number): TreeData {
    let obj: TreeData = {'': null};
    obj[''] = {nodeId: '', text: 'Root', nodes: []};

    for (let i = 0; i < Math.cbrt(size); i++) {
        let parentId = i.toString();
        obj[''].nodes.push(parentId);
        obj[parentId] = {nodeId: parentId, text: 'Parent ' + i, nodes: [], state: {expanded: true}};

        for (let k = 0; k < Math.cbrt(size); k++) {
            let childId = i + '.' + k;
            obj[childId] = {nodeId: childId, text: 'First Child ' + childId, nodes: [], state: {expanded: true}};
            obj[parentId].nodes.push(childId);

            for (let l = 0; l < Math.cbrt(size); l++) {
                let child2Id = i + '.' + k + '.' + l;
                obj[child2Id] = {nodeId: child2Id, text: 'Second Child ' + child2Id};
                obj[childId].nodes.push(child2Id);
            }
        }
    }

    return obj;
}

export function generator(): TreeData {
    return generate_object(10000);
}
