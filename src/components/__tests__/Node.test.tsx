import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Node, ParentData } from '../Node';

let parentData: ParentData;
const initState = {
    expanded: false,
    selected: false,
    disabled: false,
    checked: false
};
const subNodes = [
    {text: 'Sub Node 0', id: '0.0'},
    {text: 'Sub Node 1', id: '0.1'}
];

beforeEach(() => {
    parentData = {
        // Callbacks
        checkboxOnChange: null,
        expandOnChange: null,
        selectOnChange: null,
        onLazyLoad: null,
        showCheckbox: true,
        initSelectedNode: function(id: string) {},

        // Icons
        showIcon: true,
        showImage: true,
        nodeIcon: 'fa fa-ban fa-fw',
        checkedIcon: 'fa fa-check-square',
        uncheckedIcon: 'fa fa-square-o',
        partiallyCheckedIcon: 'fa fa-square',
        collapseIcon: 'fa fa-angle-down',
        expandIcon: 'fa fa-angle-right',
        loadingIcon: 'fa fa-spinner fa-spin',
        errorIcon: 'fa-exclamation-triangle',
        selectedIcon: 'fa fa-check',

        // Styling
        changedCheckboxClass: 'changed-checkbox',
        selectedClass: 'selected',

        // Other
        checkboxFirst: true,
    }
});

describe('node', () => {
    it('should render basic node', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={initState}
            />)
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should not render children nodes if collapsed', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={initState}
                nodes={subNodes}
            />)
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should render children nodes if expanded', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={{...initState, expanded: true}}
                nodes={subNodes}
            />)
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display unique selected icon', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={{...initState, selected: true}}
                selectedIcon={'icon icon-selected'}
            />)
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should not display any icon (checkbox, icon, expand icon)', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={{...parentData, showCheckbox: false, showIcon: false}}
                id={'0'}
                state={initState}
                hideCheckbox={true}
            />)
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display loading icon', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={initState}
                loading={true}
                lazyLoad={true}
            />)
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display error lazy loading icon', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={initState}
                loading={null}
                lazyLoad={true}
            />)
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should add custom class', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={initState}
                classes={'custom-class'}
            />)
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should indicate selected node (icon and class)', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={{...initState, selected: true}}
            />)
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should indicate changed checked node (icon and class)', () => {
        const node = renderer
            .create(<Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={{...initState, checked: false}}
            />);

        // Simulate props change
        node.update(
            <Node
                text={'Rendered Node'}
                parentData={parentData}
                id={'0'}
                state={{...initState, checked: true}}
            />
        );

        expect(node.toJSON()).toMatchSnapshot();
    });
});