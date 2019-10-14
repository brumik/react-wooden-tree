import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { Node, Tree } from '..';
import { ParentDataType } from '..';
import { ParentDataContext } from '../components/Tree';

let parentData: ParentDataType;
const initState = {
    expanded: false,
    selected: false,
    disabled: false,
    checked: false
};

const subNodes = [
    {text: 'Sub Node 0', nodeId: '0.0'},
    {text: 'Sub Node 1', nodeId: '0.1'}
];

const subNodesList = ['0.0', '0.1'];

beforeEach(() => {
    parentData = {
        // Non-redux
        tree: Tree.convertHierarchicalTree(subNodes),

        // Callbacks
        checkboxOnChange: null,
        expandOnChange: null,
        selectOnChange: null,
        onLazyLoad: null,
        showCheckbox: true,
        initSelectedNode: function(nodeId: string) { return nodeId; },

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
        connectedNode: null,
    };
});

describe('node', () => {
    it('should render basic node', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should not render empty children', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={{...initState, expanded: true}}
                        nodes={[]}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should render switched node and checkbox icon', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={{...parentData, checkboxFirst: false}}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should render expanded node with children', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={{...initState, expanded: true}}
                        nodes={subNodesList}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should not render children nodes if collapsed', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        nodes={subNodesList}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should render children nodes if expanded', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={{...initState, expanded: true}}
                        nodes={subNodesList}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display unique selected icon', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={{...initState, selected: true}}
                        selectedIcon={'icon icon-selected'}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should not display any icon (checkbox, icon, expand icon)', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={{...parentData, showCheckbox: false, showIcon: false}}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        hideCheckbox={true}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display custom icon', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={{...parentData, showCheckbox: true, showIcon: true}}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        hideCheckbox={true}
                        icon={'fa fa-custom-icon'}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display custom image as icon', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={{...parentData, showCheckbox: true, showIcon: true}}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        hideCheckbox={true}
                        icon={'fa fa-custom-icon'}
                        image={'https://www.wpsuperstars.net/wp-content/uploads/2015/01/59.png'}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display loading icon', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        loading={true}
                        lazyLoad={true}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display error lazy loading icon', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        loading={null}
                        lazyLoad={true}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should add custom class', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        classes={'custom-class'}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should indicate selected node (icon and class)', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={{...initState, selected: true}}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display partially checked icon', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={{...initState, checked: null}}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should display warning icon when undefined', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={{...initState, checked: undefined}}
                    />
                </ParentDataContext.Provider>
            )
            .toJSON();
        expect(node).toMatchSnapshot();
    });

    it('should indicate changed checked node (icon and class)', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={{...initState, checked: false}}
                    />
                </ParentDataContext.Provider>
            );

        // Simulate props change
        node.update(
            <ParentDataContext.Provider value={parentData}>
                <Node
                    text={'Rendered Node'}
                    nodeId={'0'}
                    state={{...initState, checked: true}}
                />
            </ParentDataContext.Provider>
        );

        expect(node.toJSON()).toMatchSnapshot();
    });

    it('should color the node icon with hex color', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        icon={'fa fa-circle'}
                        iconColor={'#F5F5F5'}
                    />
                </ParentDataContext.Provider>
            );
        expect(node.toJSON()).toMatchSnapshot();
    });

    it('should recolor the node icon background with rgb color', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        icon={'fa fa-circle'}
                        iconBackground={'rgb(100,255,100)'}
                    />
                </ParentDataContext.Provider>
            );
        expect(node.toJSON()).toMatchSnapshot();
    });

    it('should recolor both node icon ad icon background with color names', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        icon={'fa fa-circle'}
                        iconColor={'red'}
                        iconBackground={'green'}
                    />
              </ParentDataContext.Provider>
            );
        expect(node.toJSON()).toMatchSnapshot();
    });

    it('should recolor the default icon color and background with rgba colors', () => {
        const node = renderer
            .create(
                <ParentDataContext.Provider value={parentData}>
                    <Node
                        text={'Rendered Node'}
                        nodeId={'0'}
                        state={initState}
                        iconColor={'rgba(10,10,10,0.5)'}
                        iconBackground={'rgba(90,60,90,1)'}
                    />
                </ParentDataContext.Provider>
            );
        expect(node.toJSON()).toMatchSnapshot();

    });
});
