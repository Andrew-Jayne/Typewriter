import { FontSlot } from "@/enums.js";

const DB_NAME = "typewriter-fonts";
const STORE_NAME = "fonts";
const MAX_FONT_BYTES = 10 * 1024 * 1024;

const FAMILIES = Object.freeze({
  [FontSlot.TEXT]: "Typewriter Custom Text",
  [FontSlot.MONO]: "Typewriter Custom Mono",
});

/** @typedef {import("@/enums.js").FontSlotName} FontSlotName */
/** @typedef {{ name: string, blob: Blob }} StoredFont */

/** @type {Promise<IDBDatabase> | null} */
let connection = null;

/** @type {Map<FontSlotName, FontFace>} */
const activeFaces = new Map();

/**
 * @template T
 * @param {IDBRequest<T>} request
 * @returns {Promise<T>}
 */
function settle(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * @param {IDBTransactionMode} mode
 * @returns {Promise<IDBObjectStore>}
 */
async function getStore(mode) {
  if (connection === null) {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    connection = settle(request).catch((error) => {
      connection = null;
      throw error;
    });
  }
  return (await connection).transaction(STORE_NAME, mode).objectStore(STORE_NAME);
}

/**
 * @param {FontSlotName} slot
 * @param {Blob} blob
 * @returns {Promise<FontFace>}
 */
async function activateFont(slot, blob) {
  const face = new FontFace(FAMILIES[slot], await blob.arrayBuffer());
  await face.load();
  const previous = activeFaces.get(slot);
  if (previous !== undefined) {
    document.fonts.delete(previous);
  }
  document.fonts.add(face);
  activeFaces.set(slot, face);
  return face;
}

/**
 * Validates the file as a font, stores it, and activates it.
 * @param {FontSlotName} slot
 * @param {File} file
 */
async function saveCustomFont(slot, file) {
  if (file.size > MAX_FONT_BYTES) {
    throw new Error(`${file.name} is larger than 10 MB`);
  }
  try {
    await activateFont(slot, file);
  } catch {
    throw new Error(`${file.name} is not a valid font file`);
  }
  await settle(
    (await getStore("readwrite")).put(
      /** @type {StoredFont} */ ({ name: file.name, blob: file }),
      slot,
    ),
  );
}

/**
 * @param {FontSlotName} slot
 */
async function removeCustomFont(slot) {
  await settle((await getStore("readwrite")).delete(slot));
  const face = activeFaces.get(slot);
  if (face !== undefined) {
    document.fonts.delete(face);
    activeFaces.delete(slot);
  }
}

/**
 * Loads every stored font into document.fonts.
 * @returns {Promise<Set<FontSlotName>>} slots that loaded successfully
 */
async function loadStoredFonts() {
  /** @type {Set<FontSlotName>} */
  const loaded = new Set();
  for (const slot of Object.values(FontSlot)) {
    try {
      /** @type {StoredFont | undefined} */
      const record = await settle((await getStore("readonly")).get(slot));
      if (record === undefined) continue;
      await activateFont(slot, record.blob);
      loaded.add(slot);
    } catch (error) {
      console.error(`Could not load custom ${slot} font`, error);
    }
  }
  return loaded;
}

export { loadStoredFonts, removeCustomFont, saveCustomFont };
