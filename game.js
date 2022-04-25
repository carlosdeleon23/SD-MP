// to get all divs inside grid
const grid = document.querySelector('.grid')

// display results
const resultsDisplay = document.querySelector('.results')

// placing shooter more centered (in 202 square div)
let currentShooterIndex = 202

// grid width
let width = 15

// direction for aliens to move
let direction = 1

// invaders ID so it can be cleared
let invadersId

// to go left
let goingRight = true

// removing the aliens hit by laser
let aliensRemoved = []

// to start with a score of 0
let results = 0
// adding 225 squares inside grid
for (let i = 0; i < 225; i++) {
// each time it loops, will create a square    
    const square = document.createElement('div')
// each square created, will be added to grid
    grid.appendChild(square)
    }

/* creating the squares to search for all divs inside grid
and creating array from the divs */
const squares = Array.from(document.querySelectorAll('.grid div'))


// creating an array for invaders
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

// placing invaders inside squares and pausing on each each time
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
// if one of the numbers of the aliens array is hit than it should not be re drawn
        if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }

    
    }
}

// calling whatever we drew so far from the function draw
draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
      squares[alienInvaders[i]].classList.remove('invader')
    }
  }

// drawing shooter
squares[currentShooterIndex].classList.add('shooter')

/* to move the shooter by removing it from where it is on the grid
by using the key pressed "arrows" as long as is not zero, to the left since 
in the array is not going backwards one and move to the right if it is not with +1*/
function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) {
      case 'ArrowLeft':
        if (currentShooterIndex % width !== 0) currentShooterIndex -=1
        break
      case 'ArrowRight':
        if (currentShooterIndex % width < width -1) currentShooterIndex +=1
        break
    }
    squares[currentShooterIndex].classList.add('shooter')
}

// each time a key is pressed it will be listen to
document.addEventListener('keydown', moveShooter)

// move invaders
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
    remove()

// when getting to right edge will change direction to left side
    if (rightEdge && goingRight){
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width +1
            direction = -1
            goingRight = false
        }
    } 

// will make alines go right again and down one row after hitting right edge
if(leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width -1
      direction = 1
      goingRight = true
    }
  }

// show aliens moving
    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }
    draw()

// display game over on top of grid (html) if shooter is hit by alien
if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML ='GAME OVER'
    clearInterval(invadersId)
}

// display game over if alien hits bottom of grid
for (let i = 0; i < alienInvaders.length; i++) {
    if (alienInvaders[i] > (squares.length)) {  
        resultsDisplay.innerHTML ='GAME OVER'
        clearInterval(invadersId)
    }
}

// display you win if all aliens are shot
if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'YOU WIN'
    clearInterval(invadersId)
}
}

// move aliens
invadersId = setInterval(moveInvaders, 300)

// laser
function shoot(e) {
    let laserId
    // shooting laser from shooter
    let currentLaserIndex = currentShooterIndex
    // laser moving per pixel
    function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser') 

// removing laser, invader and adding a boom when an invader is hit
        if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')

// desapearing booms
            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)


            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results
            console.log(aliensRemoved)
        }
        }

// declaring up arrow to shoot laser
        switch(e.key) {
            case 'ArrowUp':
                laserId = setInterval(moveLaser, 100)

    }
}

document.addEventListener('keydown', shoot)