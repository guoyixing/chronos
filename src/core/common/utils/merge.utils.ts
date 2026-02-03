/**
 * 判断是否为普通对象
 * @param item Value to check
 */
function isPlainObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 深度合并两个对象
 * source 的值会覆盖 target 中的同名属性
 * 嵌套对象会递归合并，数组会被替换（不合并）
 * undefined 值会被跳过，null 值会被保留
 *
 * @param target Base object
 * @param source Override object
 * @returns Merged object
 */
export function deepMerge<T extends Record<string, unknown>>(
    target: T,
    source: Partial<T>
): T {
    const result = { ...target } as T;

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = result[key];

            if (sourceValue === undefined) {
                continue;
            }

            if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
                (result as Record<string, unknown>)[key] = deepMerge(
                    targetValue as Record<string, unknown>,
                    sourceValue as Record<string, unknown>
                );
            } else {
                (result as Record<string, unknown>)[key] = sourceValue;
            }
        }
    }

    return result;
}
