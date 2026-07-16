import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    bindAccessibilityFocusTrap,
    focusFirstVisibleAccessibilityControl,
    getVisibleA11yButtons,
} from '../src/ui/a11y/uiDomAccessibilityFocusTrap.js';

function createEl() {
    return {
        id: '',
        className: '',
        hidden: false,
        type: '',
        dataset: {},
        children: [],
        appendChild(child) {
            this.children.push(child);
            return child;
        },
        querySelectorAll(sel) {
            if (sel !== 'button.a11y-btn') return [];
            return this.children.filter((c) => c.className === 'a11y-btn');
        },
        getAttribute() {
            return null;
        },
        contains(node) {
            return this.children.includes(node) || node === this;
        },
        addEventListener(type, handler) {
            this._handlers = this._handlers || {};
            this._handlers[type] = handler;
        },
        dispatchEvent(event) {
            this._handlers?.[event.type]?.(event);
            return true;
        },
        focus: vi.fn(),
    };
}

describe('uiDomAccessibilityFocusTrap', () => {
    /** @type {{ body: object, activeElement: object | null, getElementById: Function, createElement: Function }} */
    let doc;

    beforeEach(() => {
        const body = {
            children: [],
            appendChild(node) {
                this.children.push(node);
                return node;
            },
        };
        doc = {
            body,
            activeElement: null,
            getElementById(id) {
                if (id === 'a11y-controls') {
                    return body.children.find((n) => n.id === 'a11y-controls') ?? null;
                }
                return null;
            },
            createElement() {
                return createEl();
            },
        };
        vi.stubGlobal('document', doc);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    function setupLayer(ids) {
        const layer = doc.createElement('div');
        layer.id = 'a11y-controls';
        const buttons = ids.map((id, index) => {
            const btn = doc.createElement('button');
            btn.type = 'button';
            btn.id = id;
            btn.className = 'a11y-btn';
            btn.hidden = index === ids.length - 1;
            btn.focus = vi.fn();
            layer.appendChild(btn);
            return btn;
        });
        doc.body.appendChild(layer);
        return { layer, buttons };
    }

    it('getVisibleA11yButtons ignore les boutons hidden', () => {
        setupLayer(['a', 'b', 'c']);
        expect(getVisibleA11yButtons().map((b) => b.id)).toEqual(['a', 'b']);
    });

    it('focusFirstVisibleAccessibilityControl focus le premier visible', () => {
        const { buttons } = setupLayer(['a', 'b', 'c']);
        expect(focusFirstVisibleAccessibilityControl()).toBe(true);
        expect(buttons[0].focus).toHaveBeenCalled();
    });

    it('bindAccessibilityFocusTrap cycle Tab sur les boutons visibles', () => {
        const { layer, buttons } = setupLayer(['a', 'b', 'c']);
        bindAccessibilityFocusTrap();
        doc.activeElement = buttons[1];
        const event = {
            type: 'keydown',
            key: 'Tab',
            shiftKey: false,
            preventDefault: vi.fn(),
        };
        layer.dispatchEvent(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(buttons[0].focus).toHaveBeenCalled();
    });

    it('bindAccessibilityFocusTrap appelle le handler Escape', async () => {
        const { setAccessibilityEscapeHandler } =
            await import('../src/ui/a11y/uiDomAccessibilityFocusTrap.js');
        const onEscape = vi.fn();
        setAccessibilityEscapeHandler(onEscape);
        const { layer } = setupLayer(['a', 'b', 'c']);
        bindAccessibilityFocusTrap();
        const event = {
            type: 'keydown',
            key: 'Escape',
            preventDefault: vi.fn(),
            stopPropagation: vi.fn(),
        };
        layer.dispatchEvent(event);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(onEscape).toHaveBeenCalled();
        setAccessibilityEscapeHandler(null);
    });
});
