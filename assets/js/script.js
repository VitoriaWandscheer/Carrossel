'use strict'

const slideWrapper = document.querySelector('[data-slide="wrapper"]')
const slideList = document.querySelector('[data-slide="list"]')
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]')
const navNextButton = document.querySelector('[data-slide="nav-next-button"]')
const slideControlsWrapper = document.querySelector('[data-slide="controls-wrapper"]')
const slideControlButtons = document.querySelectorAll('[data-slide="control-button"]')
const slideItems = document.querySelectorAll('[data-slide="item"]')
let startPoint = 0
let savedPosition = 0
let currentPoint = 0

function onMouseDown(event) {
    const slideItem = event.currentTarget
    startPoint = event.clientX
    currentPoint = event.clientX - savedPosition
    slideItem.addEventListener('mousemove', onMouseMove)
}

function onMouseMove(event) {
    const movement = event.clientX - startPoint
    const position = event.clientX - currentPoint
    slideList.style.transform = 'translateX('+position+'px)'
    savedPosition = position
}

function onMouseUp(event) {
    const slideItem = event.currentTarget
    slideItem.removeEventListener('mousemove', onMouseMove)
}

slideItems.forEach(function(slideItem, index) {
    slideItem.addEventListener('dragstart', function(event) {
        event.preventDefault()
    })
    slideItem.addEventListener('mousedown', onMouseDown)
    slideItem.addEventListener('mouseup', onMouseUp)
})