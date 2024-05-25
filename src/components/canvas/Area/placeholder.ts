import { extend } from 'lodash'
import * as React from 'react'
import { TAreaContext } from '.'

export function createDragPlaceholder(element: React.ReactElement, id: string) {
	if(!element) return

	const props = extend({}, element.props, {id, key: '__canvas-placeholder-drag__'})

	return React.cloneElement(element, props)
}

export function hideDragContainer(element: Element) {
	element && element.setAttribute && element.setAttribute('style', '')
}

function prepareDragPlaceholderCSS(styleProps: TRect) {
	try {
		return [
			`left: ${styleProps.left || 0}px`,
			`top: ${styleProps.top || 0}px`,
			`width: ${styleProps.width || 24}px`,
			`height: ${styleProps.height || 24}px`,
			'z-index: 999999',
			'position: absolute',
			'display: block'
		].join('; ')
	} catch (err) {
		return ''
	}
}

export function updateDragPlaceholder(
	dX: number, dY: number,
	element: Element,
	dragPlaceholder: Element,
	area: TAreaContext
) {
	if(!element) return

	const containerCoordinates = element.getBoundingClientRect()

	dragPlaceholder.setAttribute && dragPlaceholder.setAttribute('style', 
		prepareDragPlaceholderCSS({
			left: containerCoordinates.left - area.left  + dX,
			top: containerCoordinates.top - area.top + dY,
			width: containerCoordinates.width,
			height: containerCoordinates.height,
		})
	)
}