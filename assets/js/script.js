'use strict'

const slideWrapper = document.querySelector('[data-slide="wrapper"]')
const slideList = document.querySelector('[data-slide="list"]')
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]')
const navNextButton = document.querySelector('[data-slide="nav-next-button"]')
const slideControlsWrapper = document.querySelector('[data-slide="controls-wrapper"]')
const slideItems = document.querySelectorAll('[data-slide="item"]')
let controlButtons

const state = {
    startPoint: 0,
    savedPosition: 0,
    currentPoint: 0,
    movement: 0,
    currentSlideIndex: 0
}

/** MOVIMENTOS **/
function translateSlide({position}){
    state.savedPosition = position
    slideList.style.transform = `translateX(${position}px)`
}
function getCenterPosition({index}){
    const slideItem = slideItems[index]
    const slideWidth = slideItem.clientWidth
    const windowWidth = document.body.clientWidth
    const margin = (windowWidth - slideWidth) / 2
    const position = margin - (index * slideWidth)
    return position
}
function setVisibleSlide({index, animate}){
    const position = getCenterPosition({index: index})
    state.currentSlideIndex = index
    slideList.style.transition = animate === true ? 'transform .5s' : 'none'
    activeControlButton({index: index})
    translateSlide({position: position})
}
function nextSlide(){
    setVisibleSlide({index: state.currentSlideIndex + 1, animate: true})
}
function previousSlide(){
    setVisibleSlide({index: state.currentSlideIndex - 1, animate: true})
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
function activeControlButton({index}) {
    const controlButton = controlButtons[index]
    controlButtons.forEach(function(controlButtonItem){
        controlButtonItem.classList.remove('active')
    })
    controlButton.classList.add('active')
}

/** EVENT LISTENER **/
function onMouseDown(event, index) {
    const slideItem = event.currentTarget
    state.startPoint = event.clientX
    state.currentPoint = event.clientX - state.savedPosition
    state.currentSlideIndex = index
    slideList.style.transition = 'none'
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
        setVisibleSlide({index: state.currentSlideIndex, animate: true})
    }
    slideItem.removeEventListener('mousemove', onMouseMove)
}
function onControlButtonClick(index) {
    setVisibleSlide({index: index, animate: true})
}
function onSlideListTransitionEnd() {
    if(state.currentSlideIndex === slideItems.length - 2){
        setVisibleSlide({index: 2, animate: 'none'})
    }
    if(state.currentSlideIndex === 1){
        setVisibleSlide({index: -3, animate: 'none'})
    }
}

/** EVENT LISTENER **/
function setListeners(){
    controlButtons = document.querySelectorAll('[data-slide="control-button"]')

    controlButtons.forEach(function(controlButton, index) {
        controlButton.addEventListener('click', function(event) {
            onControlButtonClick(index)
        })
    })
    slideItems.forEach(function(slideItem, index) {
        slideItem.addEventListener('dragstart', function(event) {
            event.preventDefault()
        })
        slideItem.addEventListener('mousedown', function(event){
            onMouseDown(event, index)
        })
        slideItem.addEventListener('mouseup', onMouseUp)
    })
    navNextButton.addEventListener('click', nextSlide)
    navPreviousButton.addEventListener('click', previousSlide)
    slideList.addEventListener('transitionend', onSlideListTransitionEnd)
}

function initSlider(){
    createControlButtons()
    setListeners()
    setVisibleSlide({index: 2, animate: true})
}

/** Inicia o script **/
initSlider()