declare module '@redux-syringe/actions' {
	export function isErrorAction(...args: any[]): any;
	export function isNotErrorAction(...args: any[]): any;
	export function configureActionCreator(...args: any[]): any;
	export function makeActionTypes(...args: any[]): any;
	export function makeEmptyActionCreator(...args: any[]): any;
	export function makePayloadActionCreator(...args: any[]): any;
	export function makeConstantActionCreator(...args: any[]): any;
	export function makeSimpleActionCreator(...args: any[]): any;
	export function makePayloadMetaActionCreator(...args: any[]): any;
}
