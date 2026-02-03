import { describe, it, expect } from 'vitest';
import { deepMerge } from './merge.utils';

type TestRecord = Record<string, unknown>;

describe('deepMerge', () => {
    it('should merge flat objects', () => {
        const result = deepMerge<TestRecord>({ a: 1 }, { b: 2 });
        expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should deep merge nested objects', () => {
        const result = deepMerge<TestRecord>({ a: { x: 1 } }, { a: { y: 2 } });
        expect(result).toEqual({ a: { x: 1, y: 2 } });
    });

    it('should let source win for conflicting keys', () => {
        const result = deepMerge<TestRecord>({ a: 1 }, { a: 2 });
        expect(result).toEqual({ a: 2 });
    });

    it('should replace arrays (not merge)', () => {
        const result = deepMerge<TestRecord>({ arr: [1, 2] }, { arr: [3] });
        expect(result).toEqual({ arr: [3] });
    });

    it('should skip undefined values in source', () => {
        const result = deepMerge<TestRecord>({ a: 1 }, { a: undefined });
        expect(result).toEqual({ a: 1 });
    });

    it('should keep null values from source', () => {
        const result = deepMerge<TestRecord>({ a: 1 }, { a: null });
        expect(result).toEqual({ a: null });
    });

    it('should handle empty target', () => {
        const result = deepMerge<TestRecord>({}, { a: 1 });
        expect(result).toEqual({ a: 1 });
    });

    it('should handle empty source', () => {
        const result = deepMerge<TestRecord>({ a: 1 }, {});
        expect(result).toEqual({ a: 1 });
    });

    it('should not mutate original objects', () => {
        const target = { a: 1, nested: { x: 1 } };
        const source = { b: 2, nested: { y: 2 } };
        const originalTarget = JSON.parse(JSON.stringify(target));
        const originalSource = JSON.parse(JSON.stringify(source));

        deepMerge<TestRecord>(target, source);

        expect(target).toEqual(originalTarget);
        expect(source).toEqual(originalSource);
    });

    it('should handle deeply nested objects', () => {
        const result = deepMerge<TestRecord>(
            { a: { b: { c: 1 } } },
            { a: { b: { d: 2 } } }
        );
        expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
    });
});
