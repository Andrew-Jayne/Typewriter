import { state } from "./state.js";

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

/** @typedef {typeof state.keys[keyof typeof state.keys]} StateKeyValue */

/**
 * @param {string} value
 * @returns {value is StateKeyValue}
 */
export function isStateKey(value) {
  /** @type {readonly string[]} */
  const allowed = Object.values(state.keys);
  return allowed.includes(value);
}

/**
 * @param {Event} event
 * @returns {{ field: string, value: string } | null}
 */
export function readFieldInput(event) {
  if (event.currentTarget instanceof HTMLInputElement === false) return null;
  const field = event.currentTarget.dataset.field;
  if (field === undefined) return null;
  return { field: field, value: event.currentTarget.value };
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
