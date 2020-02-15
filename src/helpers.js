/**
 * @function hasOwnProperty
 * @description Utility to avoid unintended behaviours
 *
 * @param {Object} obj
 * @param {String} key
 *
 * @returns {Boolean}
 */
export const hasOwnProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
