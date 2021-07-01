import type { NodeType, NodeSpec } from 'prosemirror-model';
import { NodeParserSpec, NodeSerializerSpec } from '@milkdown/core';
import { wrappingInputRule } from 'prosemirror-inputrules';
import { CommonNode } from '../utility';

export class BulletList extends CommonNode {
    override readonly id = 'bullet_list';
    override readonly schema: NodeSpec = {
        content: 'list_item+',
        group: 'block',
        parseDOM: [{ tag: 'ul' }],
        toDOM: (node) => {
            return ['ul', { class: this.getClassName(node.attrs, 'bullet-list') }, 0];
        },
    };
    override readonly parser: NodeParserSpec = {
        match: ({ type, ordered }) => type === 'list' && !ordered,
        runner: (type, state, node) => {
            state.openNode(type);
            state.next(node.children);
            state.closeNode();
        },
    };
    override readonly serializer: NodeSerializerSpec = {
        match: (node) => node.type.name === this.id,
        runner: (node, state) => {
            state.openNode('list', undefined, { ordered: false });
            state.next(node.content);
            state.closeNode();
        },
    };
    override inputRules = (nodeType: NodeType) => [wrappingInputRule(/^\s*([-+*])\s$/, nodeType)];
}