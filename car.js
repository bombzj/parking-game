
let ctx, grid = 80, images = {}, cars, curCar, touchable = false, board=[], curMove
let touchX, touchY

function init(c, boardW, boardH, exitX, exitY) {
	cars = c
	curMove = 0
	updateBoard()
	ctx = canvas.getContext("2d")
	loadImages(['blue', 'white', 'yellow', 'black', 'train', 'board'], () => {
		drawAll(cars)
	});

	
	canvas.addEventListener("mousedown", function (event) {
		if(!touchable) {
			touchstart(event.offsetX, event.offsetY)
		}
	}, false);
	canvas.addEventListener("mousemove", function (event) {
		if(!touchable) {
			touchmove(event.offsetX, event.offsetY)
		}
	}, false);
	canvas.addEventListener("mouseup", function (event) {
		if(!touchable) {
			touchend()
		}
	}, false);
	
	canvas.addEventListener("touchstart", function (event) {
		touchable = true
		event.preventDefault(); 
		touchstart(event.touches[0].clientX, event.touches[0].clientY)
	}, false);
	canvas.addEventListener("touchmove", function (event) {
		event.preventDefault(); 
		touchmove(event.touches[0].clientX, event.touches[0].clientY)
	}, false);
	canvas.addEventListener("touchend", function (event) {
		event.preventDefault(); 
		touchend()
	}, false);
}

function drawAll(cars) {
	ctx.clearRect(0,0,canvas.width,canvas.height); 
	draw('board', 0.33, 0.33, 7.4, 7.4)
	for(let car of cars) {
		draw(car[2][2], car[0], car[1], car[2][0], car[2][1])
	}
}


function draw(file, x, y, w, h) {
	ctx.drawImage(images[file], grid * x, grid * y, grid * w, grid * h)
}


function touchstart(ex, ey) {
	let x = Math.floor(ex / grid)
	let y = Math.floor(ey / grid)
	touchX = x
	touchY = y
	for(let car of cars) {
		if(car[2][0] == 1) {	// vertical
			if(car[0] == x && car[1] <= y && car[1] + car[2][1] > y) {
				curCar = car
				return;
			}
		} else {
			if(car[1] == y && car[0] <= x && car[0] + car[2][0] > x) {
				curCar = car
				return;
			}
		}
	}
}

function touchmove(ex, ey) {
	if(curCar) {
		let x = Math.floor(ex / grid)
		let y = Math.floor(ey / grid)

		if(curCar[2][0] == 1) {	// vertical
			if(y > touchY) {
				if(board[curCar[0]][curCar[1] + curCar[2][1]] == 0) {
					curCar[1]++
					curMove++
					moveNumber.innerHTML = curMove;
					updateBoard()
				}
			} else if(y < touchY){
				if(board[curCar[0]][curCar[1] - 1] == 0) {
					curCar[1]--
					curMove++
					moveNumber.innerHTML = curMove;
					updateBoard()
				}
			}
			touchY = y;
		} else {
			if(x > touchX) {
				if(board[curCar[0] + curCar[2][0]][curCar[1]] == 0) {
					curCar[0]++
					curMove++
					moveNumber.innerHTML = curMove;
					updateBoard()
				}
			} else if(x < touchX) {
				if(board[curCar[0] - 1][curCar[1]] == 0) {
					curCar[0]--
					curMove++
					moveNumber.innerHTML = curMove;
					updateBoard()
				}
			}
			touchX = x
		}
	}
	
	drawAll(cars)
}

function touchend() {
	curCar = undefined
}

// update board occupied
function updateBoard() {
	board = updateBoardBase(cars)
}

let historyMoves, win, winMoves
async function solve() {
	historyMoves = {}
	win = false
	winMoves = []
	let pc = tryAllMoves(cars, 0)
	while(pc[0] != -1) {
		winMoves.unshift(pc[2])
		pc = pc[3]
	}
	for(let [index, cars2] of winMoves.entries()) {
		drawAll(cars2)
		moveNumber.innerHTML = index + 1
		await sleep(500)
	}
}

function tryAllMoves(carsInit, level) {
	let possibleMoves = [[-1, 0, carsInit, null, 1]]
	while(possibleMoves.length > 0) {
		let pc = possibleMoves.shift()
		let cars = pc[2]

		let board = updateBoardBase(cars)
		if(board[7][3] == 1) {
			win = true
			return pc;
		}

		for(let i = 0;i < cars.length;i++) {
			let car = cars[i]
	
			if(car[2][0] == 1) {	// vertical
				if(board[car[0]][car[1] + car[2][1]] == 0) {
					car[1]++
					if(isNewMove(cars)) {
						possibleMoves.push([i, 1, copyCars(cars), pc, pc[4] + 1]);
					}
					car[1]--
				}
				if(board[car[0]][car[1] - 1] == 0) {
					car[1]--
					if(isNewMove(cars)) {
						possibleMoves.push([i, 2, copyCars(cars), pc, pc[4] + 1]);
					}
					car[1]++
				}
			} else {
				if(board[car[0] + car[2][0]][car[1]] == 0) {
					car[0]++
					if(isNewMove(cars)) {
						possibleMoves.push([i, 3, copyCars(cars), pc, pc[4] + 1]);
					}
					car[0]--
				}
				if(board[car[0] - 1][car[1]] == 0) {
					car[0]--
					if(isNewMove(cars)) {
						possibleMoves.push([i, 4, copyCars(cars), pc, pc[4] + 1]);
					}
					car[0]++
				}
			}
		}
	}
	
}

function isNewMove(cars) {
	let hash = genHash(cars);
	if(historyMoves[hash]) {
		return false
	}
	historyMoves[hash] = 1;
	return true;
}

function updateBoardBase(cars) {
	let board = [
		[1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,1,1],
		[1,0,0,0,0,0,0,1,1],
		[1,0,0,0,0,0,0,1,1],
		[1,0,0,0,0,0,0,1,1],
		[1,0,0,0,0,0,0,1,1],
		[1,0,0,0,0,0,0,1,1],
		[1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1],
	]
	for(let car of cars) {
		if(car[2][0] == 1) {	// vertical
			for(let y = 0;y < car[2][1];y++) {
				board[car[0]][car[1] + y] = 1
			}
		} else {
			for(let x = 0;x < car[2][0];x++) {
				board[car[0] + x][car[1]] = 1
			}
		}
	}
	return board;
}

function genHash(cars) {
	let ret = new Array();
	for(let car of cars) {
		ret.push(car[0])
		ret.push(car[1])
	}
	return ret.join('')
}

function copyCars(cars) {
	let cars2 = []
	for(let car of cars) {
		cars2.push([car[0], car[1], car[2]])
	}
	return cars2
}


function loadImages(sources, callback){
	var count = 0,
			imgNum = 0
	for(let src of sources){
			imgNum++
	}
	for(let src of sources){
			images[src] = new Image(src);
			images[src].onload = images[src].onerror = function(){
					if(++count >= imgNum){
							callback(images)
					}
			};

			images[src].src = 'res/' + src + '.png'
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}