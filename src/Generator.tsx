import { NodeProps } from './components/Node';

function generate_object(size: number): NodeProps[] {
    let obj: NodeProps[] = [];

    for (let i = 0; i < Math.cbrt(size); i++) {
        obj[i] = {text: 'Parent ' + i, nodes: [], state: {expanded: true}};
        for (let k = 0; k < Math.cbrt(size); k++) {
            obj[i].nodes[k] = {text: 'First Child ' + i + '.' + k, nodes: [], state: {expanded: true}};
            for (let l = 0; l < Math.cbrt(size); l++) {
                obj[i].nodes[k].nodes[l] = {text: 'Second Child ' + i + '.' + k + '.' + l};
            }
        }
    }

    return obj;
}

export function generator(): NodeProps {
    return {
        text: 'Root',
        nodes: generate_object(1000)
    };
}