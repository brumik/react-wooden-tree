import { NodeProps } from './components/Node';

// function generate_object(size: number): NodeProps[] {
//     let obj: NodeProps[] = [];
//
//     for (let i = 0; i < Math.cbrt(size); i++) {
//         obj[i] = {text: 'Parent ' + i, nodes: [], state: {expanded: true}};
//         for (let k = 0; k < Math.cbrt(size); k++) {
//             obj[i].nodes[k] = {text: 'First Child ' + i + '.' + k, nodes: [], state: {expanded: true}};
//             for (let l = 0; l < Math.cbrt(size); l++) {
//                 obj[i].nodes[k].nodes[l] = {text: 'Second Child ' + i + '.' + k + '.' + l};
//             }
//         }
//     }
//
//     return obj;
// }

export function generator(): NodeProps {
    return {
        text: 'Root',
        nodes: [
            {text: 'Node 1',
                nodes: [
                    {text: 'Node 1.1', state: {checked: true}},
                    {text: 'Node 1.2', checkable: false}
                ]
            },
            {text: 'Node 2', state: {expanded: true}, checkable: false,
                nodes: [
                    {text: 'Node 2.1', state: {checked: true}},
                    {text: 'Node 2.2'}
                ]
            },
            {text: 'Node 3', state: {expanded: false},
                nodes: [
                    {text: 'Node 3.1', state: {checked: false}},
                    {text: 'Node 3.2', state: {checked: true}}
                ]
            }
        ]
    };
}