/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml externs */
/** @const */
var _myNewPackage = {}
/**
 * Options for the program.
 * @record
 */
_myNewPackage.Config
/**
 * A boolean option. Default `true`.
 * @type {boolean|undefined}
 */
_myNewPackage.Config.prototype.shouldRun
/**
 * A text to return.
 * @type {string|undefined}
 */
_myNewPackage.Config.prototype.text

/* typal types/api.xml externs */
/**
 * {{ description }}
 * @typedef {function(!_myNewPackage.Config): !Promise<string>}
 */
_myNewPackage.myNewPackage
