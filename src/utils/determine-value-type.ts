/**
 * 判断字符串是否是JSON字符串
 * @param str 字符串
 * @returns
 *  jsonString: 是有效的 JSON 字符串
 *  normalString: 是普通字符串
 *  object: 是对象
 *  unknown: 其他类型
 */
export function determineValueType(value: string | object) {
  // 检查是否是对象（排除 null，因为 typeof null 也会返回 'object'）
  if (typeof value === 'object' && value !== null) {
    return 'object' // 是对象
  }

  // 检查是否是字符串
  if (typeof value === 'string') {
    // 尝试解析 JSON 字符串
    try {
      const parsed = JSON.parse(value)
      if (typeof parsed === 'object' && parsed !== null) {
        return 'jsonString' // 是有效的 JSON 字符串
      }
      else {
        return 'normalString' // 是普通字符串
      }
    }
    catch {
      return 'normalString' // 解析失败，说明是普通字符串
    }
  }

  return 'unknown' // 其他类型
}
