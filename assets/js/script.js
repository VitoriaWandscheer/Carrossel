'use strict'

const slideWrapper = document.querySelector('[data-slide="wrapper"]')
const slideList = document.querySelector('[data-slide="list"]')
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]')
const navNextButton = document.querySelector('[data-slide="nav-next-button"]')
const slideControlsWrapper = document.querySelector('[data-slide="controls-wrapper"]')
let slideItems = document.querySelectorAll('[data-slide="item"]')
let controlButtons
let slideInterval

const state = {
    startPoint: 0,
    savedPosition: 0,
    currentPoint: 0,
    movement: 0,
    currentSlideIndex: 0,
    autoPlay: true,
    timeInterval: 0
}

/** MOVIMENTOS
 * 
*/
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
    if(index === 0 || index === slideItems.length - 1){
        index = state.currentSlideIndex
    }
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

/** Control Buttons
 * 
*/
function createControlButtons(){
    slideItems.forEach(function(){
        const controlButton = document.createElement('button')
        controlButton.classList.add('slide-control-button')
        controlButton.setAttribute('data-slide', 'control-button')
        slideControlsWrapper.append(controlButton)
    })
}
function activeControlButton({index}) {
    const slideItem = slideItems[index]
    const dataIndex = Number(slideItem.dataset.index)
    const controlButton = controlButtons[dataIndex]
    controlButtons.forEach(function(controlButtonItem){
        controlButtonItem.classList.remove('active')
    })
    if(controlButton) {
        controlButton.classList.add('active')
    }
}

/** Slide Clones
 * 
*/
function createSlideClones() {
    const firstSlide = slideItems[0].cloneNode(true)
    firstSlide.classList.add('slide-cloned')
    firstSlide.dataset.index = slideItems.length

    const secondSlide = slideItems[1].cloneNode(true)
    secondSlide.classList.add('slide-cloned')
    secondSlide.dataset.index = slideItems.length + 1

    const lastSlide = slideItems[slideItems.length - 1].cloneNode(true)
    lastSlide.classList.add('slide-cloned')
    lastSlide.dataset.index = -1

    const penultimateSlide = slideItems[slideItems.length - 2 ].cloneNode(true)
    penultimateSlide.classList.add('slide-cloned')
    penultimateSlide.dataset.index = -2

    slideList.append(firstSlide)
    slideList.append(secondSlide)
    slideList.prepend(lastSlide)
    slideList.prepend(penultimateSlide)

    slideItems = document.querySelectorAll('[data-slide="item"]')
}

/** EVENT LISTENER MOUSE
 * Realiza os comandos do Mouse.
*/
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
    const pointToMove = event.type.includes('touch') ? 50 : 150
    const slideItem = event.currentTarget
    if (state.movement < -pointToMove) {
        nextSlide()
    } else if (state.movement > pointToMove) {
        previousSlide()
    } else {
        setVisibleSlide({index: state.currentSlideIndex, animate: true})
    }
    slideItem.removeEventListener('mousemove', onMouseMove)
}

/** EVENT LISTENER TOUCH
 * Realiza os comandos Touch.
*/
function onTouchStart(event, index){
    event.clientX = event.touches[0].clientX
    onMouseDown(event, index)
    const slideItem = event.currentTarget
    slideItem.addEventListener('touchmove', onTouchMove)
}
function onTouchMove(event){
    event.clientX = event.touches[0].clientX
    onMouseMove(event)
}
function onTouchEnd(event){
    onMouseUp(event)
    const slideItem = event.currentTarget
    slideItem.removeEventListener('touchmove', onTouchMove)
}
/** EVENT LISTENER ControlButton
 * Realiza os comando ao clicar no botão de controle.
*/
function onControlButtonClick(index) {
    setVisibleSlide({index: index + 2, animate: true})
}

function onSlideListTransitionEnd() {
    if(state.currentSlideIndex === slideItems.length - 2){
        setVisibleSlide({index: 2, animate: 'none'})
    }
    if(state.currentSlideIndex === 1 ){
        setVisibleSlide({index: slideItems.length - 3, animate: 'none'})
    }
}
function setAutoPlay() {
    if (state.autoPlay) {
        slideInterval = setInterval(function() {
            setVisibleSlide({index: state.currentSlideIndex + 1, animate: true})
        }, state.timeInterval)
    }
}

/** EVENT LISTENER Inicial.
 * Escuta os comandos do Mouse e do Touch.
*/
function setListeners(){
    controlButtons = document.querySelectorAll('[data-slide="control-button"]')
    
    /**
     * Ao clicar em um ControlButton chama a função onControlButtonClick.
     */
    controlButtons.forEach(function(controlButton, index) {
        controlButton.addEventListener('click', function(event) {
            onControlButtonClick(index)
        })
    })

    /**
     * Ao arrastar um slide, tanto com o Mouse quanto com o Touch, chama a função correspondente ao comando.
     */
    slideItems.forEach(function(slideItem, index) {
        slideItem.addEventListener('dragstart', function(event) {
            event.preventDefault()
        })
        slideItem.addEventListener('mousedown', function(event){
            onTouchStart(event, index)
        })
        slideItem.addEventListener('mouseup', onMouseUp)

        slideItem.addEventListener('touchstart', function(event){
            onTouchStart(event, index)
        })
        slideItem.addEventListener('touchend', onTouchEnd)
    })

    /**
     * Ao clicar em um navButton chama a função correspondente ao botão (navNextButton/navPreviousButton).
     */
    navNextButton.addEventListener('click', nextSlide)
    navPreviousButton.addEventListener('click', previousSlide)

    /**
     * Responsável pelas transições.
     */
    slideList.addEventListener('transitionend', onSlideListTransitionEnd)
    slideWrapper.addEventListener('mouseenter', function() {
        clearInterval(slideInterval)
    })
    slideWrapper.addEventListener('mouseleave', function(){ 
        setAutoPlay()
    })
}

/** Inicia o Slider.
 * Chama todas as funções iniciais.
*/
function initSlider({startAtIndex = 0, autoPlay = true, timeInterval = 3000}){
    state.autoPlay = autoPlay
    state.timeInterval = timeInterval
    createControlButtons()
    createSlideClones()
    setListeners()
    setVisibleSlide({index: startAtIndex + 2, animate: true})
    setAutoPlay()
}

// Chama a função initSlider e atribui os valores necessários.  
initSlider({
    autoPlay: false,
    startAtIndex: 0,
    timeInterval: 3000
})