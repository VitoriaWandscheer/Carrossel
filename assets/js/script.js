'use strict'

const slideWrapper = document.querySelector('[data-slide="wrapper"]')
const slideList = document.querySelector('[data-slide="list"]')
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]')
const navNextButton = document.querySelector('[data-slide="nav-next-button"]')
const slideControlsWrapper = document.querySelector('[data-slide="controls-wrapper"]')
const slideControlButtons = document.querySelectorAll('[data-slide="control-button"]')
const slideItems = document.querySelectorAll('[data-slide="item"]')

function onMouseDown(event) {
    const slideItem = event.currentTarget
    slideItem.addEventListener('mousemove', onMouseMove)
    console.log('Apertei o botão do mouse.')
}

function onMouseMove(event) {
    console.log('Movimentei o mouse em cima do elemento.')
}

function onMouseUp(event) {
    const slideItem = event.currentTarget
    slideItem.removeEventListener('mousemove', onMouseMove)
    console.log('Soltei o botão do mouse.')
}

slideItems.forEach(function(slideItem, index) {
    slideItem.addEventListener('dragstart', function(event) {
        event.preventDefault()
    })
    slideItem.addEventListener('mousedown', onMouseDown)
    slideItem.addEventListener('mouseup', onMouseUp)
})