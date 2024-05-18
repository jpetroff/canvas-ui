import type { TCanvasContainerElement } from "./container"

export const enum LAYOUT_RULE {
	horizontal = 'horizontal',
	vertical = 'vertical',
	columns = 'columns',
	css = 'css'
}

export interface ILayoutOptions {
	moduleSize?: number
	layout?: LAYOUT_RULE
	moduleGap?: number
	normalizeWidth?: boolean
	normalizeHeight?: boolean
	minW?: number
	minH?: number
	maxW?: number
	maxH?: number
	columns?: number
}

export interface ICanvasCoordsCollection {
	[key: string]: ICanvasContainerCoords
}

export type TChildrenContainers = (HTMLElement & TCanvasContainerElement)[]