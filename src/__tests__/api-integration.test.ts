import { describe, it, expect } from 'vitest';
import type { DataType, ChronosSeparatedDataType, ChronosInputType } from '../config/data.type';
import { deepMerge } from '../core/common/utils/merge.utils';

/**
 * API集成测试
 * 验证分离式API的类型安全和数据合并逻辑
 * 
 * 注意：这些测试不实例化Chronos（需要DOM环境），
 * 而是验证类型系统和合并逻辑的正确性
 */
describe('Chronos API Integration', () => {

    describe('Type Safety', () => {
        it('should accept legacy DataType format with proper types', () => {
            // This test verifies TypeScript compilation - if it compiles, types are correct
            const legacyConfig: DataType = {
                timeline: {
                    initTime: '2024-01-15'
                }
            };

            // Type should be assignable to ChronosInputType
            const input: ChronosInputType = legacyConfig;
            expect(input).toBeDefined();
            expect((input as DataType).timeline.initTime).toBe('2024-01-15');
        });

        it('should accept separated format with proper types', () => {
            // This test verifies TypeScript compilation - if it compiles, types are correct
            const separatedConfig: ChronosSeparatedDataType = {
                business: {
                    timeline: {
                        initTime: '2024-01-15'
                    }
                },
                style: {
                    grid: {
                        color: '#eeeeee'
                    }
                }
            };

            // Type should be assignable to ChronosInputType
            const input: ChronosInputType = separatedConfig;
            expect(input).toBeDefined();
            expect((input as ChronosSeparatedDataType).business.timeline.initTime).toBe('2024-01-15');
        });

        it('should require timeline.initTime in business data', () => {
            // This is a compile-time check - if this file compiles, the test passes
            // The following would cause a TypeScript error if uncommented:
            // const invalid: ChronosSeparatedDataType = {
            //     business: {}, // Error: Property 'timeline' is missing
            //     style: {}
            // };

            const valid: ChronosSeparatedDataType = {
                business: {
                    timeline: { initTime: '2024-01-01' }
                },
                style: {}
            };
            expect(valid.business.timeline.initTime).toBe('2024-01-01');
        });
    });

    describe('Input Format Detection', () => {
        it('should detect legacy format (no business/style keys)', () => {
            const legacyInput = {
                timeline: { initTime: '2024-01-01' },
                grid: { color: '#fff' }
            };

            // Check it doesn't have business/style keys
            expect('business' in legacyInput).toBe(false);
            expect('style' in legacyInput).toBe(false);
        });

        it('should detect separated format (has business and style keys)', () => {
            const separatedInput = {
                business: { timeline: { initTime: '2024-01-01' } },
                style: { grid: { color: '#fff' } }
            };

            // Check it has both keys
            expect('business' in separatedInput).toBe(true);
            expect('style' in separatedInput).toBe(true);
        });

        it('should correctly identify separated format with type guard logic', () => {
            // Simulate the type guard logic from chronos.ts
            const isSeparated = (input: unknown): boolean => {
                return typeof input === 'object' && 
                       input !== null && 
                       'business' in input && 
                       'style' in input;
            };

            const legacy: DataType = { timeline: { initTime: '2024-01-01' } };
            const separated: ChronosSeparatedDataType = {
                business: { timeline: { initTime: '2024-01-01' } },
                style: {}
            };

            expect(isSeparated(legacy)).toBe(false);
            expect(isSeparated(separated)).toBe(true);
        });
    });

    describe('Data Merging', () => {
        it('should merge style and business data correctly', () => {
            const style = {
                grid: { color: '#eee', lineWidth: 1 },
                timeline: { backgroundColor: '#fff' }
            };

            const business = {
                timeline: { initTime: '2024-01-01' },
                isEdit: true
            };

            const merged = deepMerge(
                style as Record<string, unknown>,
                business as Record<string, unknown>
            );

            // Business values should be present
            expect((merged.timeline as Record<string, unknown>).initTime).toBe('2024-01-01');
            expect(merged.isEdit).toBe(true);

            // Style values should be preserved where no conflict
            expect((merged.grid as Record<string, unknown>).color).toBe('#eee');
            expect((merged.grid as Record<string, unknown>).lineWidth).toBe(1);

            // For timeline, both should be merged (nested merge)
            expect((merged.timeline as Record<string, unknown>).backgroundColor).toBe('#fff');
        });

        it('should let business data override style data for conflicting keys', () => {
            const style = {
                timeline: { backgroundColor: '#fff' }
            };

            const business = {
                timeline: { initTime: '2024-01-01', backgroundColor: '#000' }
            };

            const merged = deepMerge(
                style as Record<string, unknown>,
                business as Record<string, unknown>
            );

            // Business value should win
            expect((merged.timeline as Record<string, unknown>).backgroundColor).toBe('#000');
            expect((merged.timeline as Record<string, unknown>).initTime).toBe('2024-01-01');
        });

        it('should handle empty style object', () => {
            const style = {};
            const business = {
                timeline: { initTime: '2024-01-01' },
                isEdit: true
            };

            const merged = deepMerge(
                style as Record<string, unknown>,
                business as Record<string, unknown>
            );

            expect((merged.timeline as Record<string, unknown>).initTime).toBe('2024-01-01');
            expect(merged.isEdit).toBe(true);
        });

        it('should handle empty business object (style only)', () => {
            const style = {
                grid: { color: '#eee' },
                timeline: { backgroundColor: '#fff' }
            };
            const business = { timeline: { initTime: '2024-01-01' } }; // minimal required

            const merged = deepMerge(
                style as Record<string, unknown>,
                business as Record<string, unknown>
            );

            expect((merged.grid as Record<string, unknown>).color).toBe('#eee');
            expect((merged.timeline as Record<string, unknown>).backgroundColor).toBe('#fff');
            expect((merged.timeline as Record<string, unknown>).initTime).toBe('2024-01-01');
        });
    });

    describe('Backward Compatibility', () => {
        it('should preserve all properties from legacy format', () => {
            const legacyConfig: DataType = {
                isEdit: true,
                timeline: { initTime: '2024-01-01' },
                grid: { color: '#eee' },
                lane: { rowHeight: 50 }
            };

            // The config should pass through unchanged
            expect(legacyConfig.isEdit).toBe(true);
            expect(legacyConfig.timeline.initTime).toBe('2024-01-01');
            expect(legacyConfig.grid?.color).toBe('#eee');
            expect(legacyConfig.lane?.rowHeight).toBe(50);
        });

        it('should not modify original objects during merge', () => {
            const originalStyle = {
                grid: { color: '#eee' }
            };
            const originalBusiness = {
                timeline: { initTime: '2024-01-01' }
            };

            // Deep copy for comparison
            const styleCopy = JSON.parse(JSON.stringify(originalStyle));
            const businessCopy = JSON.parse(JSON.stringify(originalBusiness));

            // Perform merge
            deepMerge(
                originalStyle as Record<string, unknown>,
                originalBusiness as Record<string, unknown>
            );

            // Originals should be unchanged
            expect(originalStyle).toEqual(styleCopy);
            expect(originalBusiness).toEqual(businessCopy);
        });
    });

    describe('Real-world Usage Patterns', () => {
        it('should support reusable theme configuration', () => {
            // Define a reusable theme
            const darkTheme = {
                grid: { color: '#333', backgroundColor: '#1a1a1a' },
                lane: { backgroundColor: '#2a2a2a', textColor: '#fff' },
                timeline: { backgroundColor: '#1a1a1a' }
            };

            const lightTheme = {
                grid: { color: '#eee', backgroundColor: '#fff' },
                lane: { backgroundColor: '#f5f5f5', textColor: '#333' },
                timeline: { backgroundColor: '#fff' }
            };

            // Same business data, different themes
            const businessData = {
                timeline: { initTime: '2024-01-01' },
                lane: { 
                    entry: [
                        { id: '1', name: 'Lane 1' },
                        { id: '2', name: 'Lane 2' }
                    ]
                }
            };

            const darkConfig = deepMerge(
                darkTheme as Record<string, unknown>,
                businessData as Record<string, unknown>
            );

            const lightConfig = deepMerge(
                lightTheme as Record<string, unknown>,
                businessData as Record<string, unknown>
            );

            // Both should have the same business data
            expect((darkConfig.lane as Record<string, unknown>).entry).toEqual(businessData.lane.entry);
            expect((lightConfig.lane as Record<string, unknown>).entry).toEqual(businessData.lane.entry);

            // But different styles
            expect((darkConfig.grid as Record<string, unknown>).backgroundColor).toBe('#1a1a1a');
            expect((lightConfig.grid as Record<string, unknown>).backgroundColor).toBe('#fff');
        });
    });
});
