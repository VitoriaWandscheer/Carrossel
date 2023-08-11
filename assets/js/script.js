'use strict'

const slideWrapper = document.querySelector('[data-slide="wrapper"]')
const slideList = document.querySelector('[data-slide="list"]')
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]')
const navNextButton = document.querySelector('[data-slide="nav-next-button"]')
const slideControlsWrapper = document.querySelector('[data-slide="controls-wrapper"]')
const slideControlButtons = document.querySelectorAll('[data-slide="control-button"]')
const slideItems = document.querySelectorAll('[data-slide="item"]')

const state = {
    startPoint: 0,
    savedPosition: 0,
    currentPoint: 0,
    movement: 0,
    currentSlideIndex: 0
}

function onMouseDown(event, index) {
    const slideItem = event.currentTarget
    state.startPoint = event.clientX
    state.currentPoint = event.clientX - state.savedPosition
    state.currentSlideIndex = index
    console.log(state.currentSlideIndex)
    slideItem.addEventListener('mousemove', onMouseMove)
}
function onMouseMove(event) {
    state.movement = event.clientX - state.startPoint
    const position = event.clientX - state.currentPoint
    slideList.style.transform = 'translateX('+position+'px)'
    state.savedPosition = position
}
function onMouseUp(event) {
    const slideItem = event.currentTarget
    const slideWidht = slideItem.clientWidth
    if (state.movement < -150) {
        const position = (state.currentSlideIndex + 1) * slideWidht
        slideList.style.transform = 'translateX('+(-position)+'px)'
        state.savedPosition = -position
    } else if (state.movement > 150) {
        const position = (state.currentSlideIndex - 1) * slideWidht
        slideList.style.transform = 'translateX('+(-position)+'px)'
        state.savedPosition = -position
    } else {
        const position = (state.currentSlideIndex) * slideWidht
        slideList.style.transform = 'translateX('+(-position)+'px)'
        state.savedPosition = -position
    }
    slideItem.removeEventListener('mousemove', onMouseMove)
}
slideItems.forEach(function(slideItem, index) {
    slideItem.addEventListener('dragstart', function(event) {
        event.preventDefault()
    })
    slideItem.addEventListener('mousedown', function(event){
        onMouseDown(event, index)
    })
    slideItem.addEventListener('mouseup', onMouseUp)
})