'use strict'

const slideWrapper = document.querySelector('[data-slide="wrapper"]')
const slideList = document.querySelector('[data-slide="list"]')
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]')
const navNextButton = document.querySelector('[data-slide="nav-next-button"]')
const slideControlsWrapper = document.querySelector('[data-slide="controls-wrapper"]')
const slideItems = document.querySelectorAll('[data-slide="item"]')

const state = {
    startPoint: 0,
    savedPosition: 0,
    currentPoint: 0,
    movement: 0,
    currentSlideIndex: 0
}

/** MOVIMENTOS **/
function translateSlide({ position }){
    state.savedPosition = position
    slideList.style.transform = `translateX(${position}px)`
}
function getCenterPosition({ index: index }){
    const slideItem = slideItems[index]
    const slideWidth = slideItem.clientWidth
    const windowWidth = document.body.clientWidth
    const margin = (windowWidth - slideWidth) / 2
    const position = margin - (index * slideWidth)
    return position
}
function setVisibleSlide({ index: index }){
    const position = getCenterPosition({index: index})
    state.currentSlideIndex = index
    translateSlide({position: position})
}
function nextSlide(){
    setVisibleSlide({index: state.currentSlideIndex + 1})
}
function previousSlide(){
    setVisibleSlide({index: state.currentSlideIndex - 1})
}

/** Control Buttons **/
function createControlButtons(){
    slideItems.forEach(function(){
        const controlButton = document.createElement('button')
        controlButton.classList.add('slide-control-button')
        controlButton.setAttribute('data-slide', 'control-button')
        slideControlsWrapper.append(controlButton)
    })
}

/** EVENT LISTENER: Mouse **/
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
    translateSlide({ position: position })
    state.savedPosition = position
}
function onMouseUp(event) {
    const slideItem = event.currentTarget
    const slideWidht = slideItem.clientWidth
    if (state.movement < -150) {
        nextSlide()
    } else if (state.movement > 150) {
        previousSlide()
    } else {
        setVisibleSlide({index: state.currentSlideIndex})
    }
    slideItem.removeEventListener('mousemove', onMouseMove)
}



/** EVENT LISTENER: Setas **/
function setListeners(){
    const slideControlButtons = document.querySelectorAll('[data-slide="control-button"]')

    slideItems.forEach(function(slideItem, index) {
        slideItem.addEventListener('dragstart', function(event) {
            event.preventDefault()
        })
        slideItem.addEventListener('mousedown', function(event){
            onMouseDown(event, index)
        })
        slideItem.addEventListener('mouseup', onMouseUp)
    })
}

function initSlider(){
    createControlButtons()
    setListeners()
    setVisibleSlide(0)
}



/** Inicia o script **/
initSlider()