import { NodeProps } from './components/Node';

export function generator(): NodeProps {
    return {
        text: 'Root',
        nodes: [
            {text: 'First node'},
            {text: 'Parent node', state: {expanded: true},
                nodes: [
                    {text: 'Child node 1'},
                    {text: 'Child node 2', state: {expanded: true},
                        nodes: [
                            {text: 'Child node 2.1'},
                            {text: 'Child node 2.2'},
                            {text: 'Child node 2.3'}
                        ]
                    }
                ]
            }
        ]
    };
}