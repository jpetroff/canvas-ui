import { bind, defaults } from "lodash"
import { ILayoutOptions, LAYOUT_RULE } from "./types"
import funcHorizontalLayout from './layout-horizontal'
import funcVerticalLayout from './layout-vertical'
import funcCSSLayout from './layout-css-defined'


class LayoutEngine {
	layoutOptions: ILayoutOptions

	constructor(opts?: ILayoutOptions) {
		this.layoutOptions = defaults<any, ILayoutOptions>(opts || {}, {
			moduleSize: 16,
			moduleGap: 2,
			normalizeWidth: true,
			normalizeHeight: false,
			layout: LAYOUT_RULE.horizontal
		})
	}

	calcLayout(currentCoords: ICanvasContainerCoords[]) : ICanvasContainerCoords[] {
		switch(this.layoutOptions.layout) {
			case LAYOUT_RULE.horizontal: return this.calcLayoutHorizontal(currentCoords);
			case LAYOUT_RULE.vertical: return this.calcLayoutVertical(currentCoords);
			case LAYOUT_RULE.css: return this.calcLayoutCSS(currentCoords);
			default: return currentCoords;
		}
	}

	calcContainerBoundingRects(elements: Element[]) : ICanvasContainerCoords[] {
		let result : ICanvasContainerCoords[] = []
		elements.map( (element, index) => {

			const elementBoundingRect = element.getBoundingClientRect()
			const elementStyleMap = window.getComputedStyle(element)

			const elementNormalizedHeight = this.normalizeDimensionValue(elementBoundingRect.height)
			const elementNormalizedWidth = this.normalizeDimensionValue(elementBoundingRect.width)

			result.push({
				height: this.layoutOptions.normalizeHeight ? elementNormalizedHeight : elementBoundingRect.height,
				width: this.layoutOptions.normalizeWidth ? elementNormalizedWidth : elementBoundingRect.width,
				moduleY: this.calcTop(elementStyleMap),
				moduleX: this.calcLeft(elementStyleMap),
				moduleH: elementNormalizedHeight / this.layoutOptions.moduleSize,
				moduleW: elementNormalizedWidth / this.layoutOptions.moduleSize,
				key: element.getAttribute('data-key'),
				index
			})
		})
		return result
	}

	normalizeDimensionValue(currentLength: number) : number {
		const mod = currentLength % this.layoutOptions.moduleSize
		if(mod > 0) return (Math.floor(currentLength / this.layoutOptions.moduleSize) + 1) * this.layoutOptions.moduleSize

		return currentLength
	}

	private calcLayoutHorizontal = bind(funcHorizontalLayout, this)
	private calcLayoutVertical = bind(funcVerticalLayout, this)
	private calcLayoutCSS = bind(funcCSSLayout, this)

	calcTop(elementStyleMap: CSSStyleDeclaration) : number | undefined {
		const currentTop = elementStyleMap.getPropertyValue('top')

		if(currentTop && currentTop != 'auto') {
			return parseInt(currentTop.toString())
		}

		return undefined
	}

	calcLeft(elementStyleMap: CSSStyleDeclaration) : number | undefined {
		const currentLeft = elementStyleMap.getPropertyValue('left')

		if(currentLeft && currentLeft != 'auto') {
			return parseInt(currentLeft.toString())
		}

		return undefined
	}

	moduleToPx(module: number): number {
		return this.layoutOptions.moduleSize * module
	}

	pxToModule(px: number): number {
		return (Math.round(px / this.layoutOptions.moduleSize)) * this.layoutOptions.moduleSize
	}

	moduleToCSSStyle(module: number) : string {
		return (this.layoutOptions.moduleSize * module).toString() + 'px'
	}

}

export default LayoutEngine