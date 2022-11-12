/**
 * email pattern
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/;

/**
  * phone number pattern
  */
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

/**
  * first and last name pattern
  * https://stackoverflow.com/questions/14088714/regular-expression-for-name-field-in-javascript-validation
  */
export const NAME_REGEX = /^([a-zA-Z ]){2,64}$/;