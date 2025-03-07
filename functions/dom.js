
/**
 * 
 * @param {String} tagName 
 * @param {Object} attributes 
 * @returns {HTMLElement}
 */
export function createELement(tagName, attributes){
     const element = document.createElement(tagName)
     for( const [attribute, value] of Object.entries(attributes)){
        if (value !== null) {
            element.setAttribute(attribute, value)
        }
     }
     return element
}