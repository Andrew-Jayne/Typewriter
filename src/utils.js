/**
 * @param {string} id
 * @returns {HTMLElement}
 * Get an element, and throw if null, should never fail
 */
export function getElement(id) {
  const element = document.getElementById(id);
  if (element === undefined || element === null) {
    throw new Error(`Element #${id} is missing`);
  }
  return element;
}

/**
 * @param {string} id
 * @returns {HTMLInputElement}
 * Get an input element, and throw if null, should never fail
 */
export function getInputElement(id) {
  const element = document.getElementById(id);
  if (
    element === undefined ||
    element === null ||
    element instanceof HTMLInputElement === false
  ) {
    throw new Error(`Element #${id} is missing`);
  }
  return element;
}

/**
 * @param {string} id
 * @returns {HTMLSelectElement}
 * Get a select element, and throw if null, should never fail
 */
export function getSelectElement(id) {
  const element = document.getElementById(id);
  if (element instanceof HTMLSelectElement === false) {
    throw new Error(`Element #${id} is missing`);
  }
  return element;
}

/**
 * @template {Record<string, unknown>} T
 * @param {T} enumObject
 * @param {unknown} value
 * @returns {value is T[keyof T]}
 */
export function isValueOf(enumObject, value) {
  /** @type {readonly unknown[]} */
  const values = Object.values(enumObject);
  return values.includes(value);
}

/**
 * @template {object} T
 * @param {T} object
 * @param {unknown} key
 * @returns {key is keyof T}
 */
export function isKeyOf(object, key) {
  return typeof key === "string" && Object.hasOwn(object, key);
}
