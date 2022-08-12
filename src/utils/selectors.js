/**
 * 
 * @param {string} selector 
 * @param {HTMLElement} node = document.body
 * @returns {HTMLElement}
 */
 export function $(selector, node = document.body) {
    return node.querySelector(selector);
}
/**
 *  
 * @param {string} selector 
 * @param {HTMLElement} node = document.body
 */
export function $$(selector, node = document.body) {
    return [...node.querySelectorAll(selector)];
}