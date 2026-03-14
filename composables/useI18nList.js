/**
 * 從 Vue I18n 的 message 物件中取出顯示字串。
 * @param {unknown} val - 單一值（字串或 message 物件）
 * @returns {string}
 */
function resolveMessageValue(val) {
  if (val == null) return ''
  if (typeof val === 'string') return val
  if (val && typeof val === 'object') {
    if (val.body?.static != null) return String(val.body.static)
    if (val.loc?.source != null) return String(val.loc.source)
  }
  return ''
}

/**
 * 判斷是否為 Vue I18n 編譯後的 message 物件。
 * @param {unknown} val
 * @returns {boolean}
 */
function isMessageObject(val) {
  return (
    val &&
    typeof val === 'object' &&
    (val.body != null || (val.loc && 'source' in val.loc))
  )
}

/**
 * 遞迴解析巢狀結構中的 message 物件為字串。
 * 用於 capabilities、experiences 等 tm() 回傳的物件陣列。
 *
 * @param {unknown} val - tm(key) 的回傳值（陣列、物件或 message 物件）
 * @returns {unknown} 解析後的純值（字串、字串陣列、或一般物件）
 */
function resolveNestedMessages(val) {
  if (val == null) return val
  if (typeof val === 'string') return val
  if (typeof val === 'number' || typeof val === 'boolean') return val
  if (isMessageObject(val)) return resolveMessageValue(val)
  if (Array.isArray(val)) return val.map(resolveNestedMessages)
  if (typeof val === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(val)) out[k] = resolveNestedMessages(v)
    return out
  }
  return val
}

/**
 * 將 Vue I18n tm() 回傳的 message 陣列轉成字串陣列。
 * tm() 在陣列型 key 時會回傳編譯後的 message 物件（含 type, loc, body 等），
 * 此 helper 取出實際顯示文字（body.static 或 loc.source）供模板使用。
 *
 * @param {unknown} value - tm(key) 的回傳值
 * @returns {string[]}
 */
function resolveMessageList(value) {
  if (!value || !Array.isArray(value)) return []
  return value.map(item => {
    if (typeof item === 'string') return item
    if (item && typeof item === 'object') {
      if (item.body && typeof item.body.static === 'string') return item.body.static
      if (item.loc && typeof item.loc.source === 'string') return item.loc.source
    }
    return ''
  })
}

export function useI18nList() {
  return {
    resolveMessageList,
    resolveMessageValue,
    resolveNestedMessages,
  }
}
