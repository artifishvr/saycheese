window.onload = function () {
  // styles

  document.body.style =
    "display:flex;justify-content:center;flex-direction:column;align-items:center;height:100vh;background-color:#18181b; font-family: 'Courier New', monospace; overflow:hidden;";

  const header = document.createElement("h1");
  header.className = "p";
  header.style = "color: #fafafa; text-align: center; font-size: 32px;";
  header.innerHTML = "QR Code Snake";

  const controls = document.createElement("p");
  controls.className = "p";
  controls.style = "color: #fafafa; text-align: center;";
  controls.innerHTML = "MOVE [←↑↓→] PAUSE [space]";

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  canvas.style.display = "block";
  canvas.style.margin = "auto";
  canvas.style =
    "border-radius: 5px; background-color: #09090b; box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.5);";

  document.body.appendChild(header);
  document.body.appendChild(canvas);
  document.body.appendChild(controls);

  const context = canvas.getContext("2d");

  // game variables
  // the canvas width & height, snake x & y, and the apple x & y, all need to be a multiples of the grid size in order for collision detection to work
  // (e.g. 16 * 25 = 400)
  const grid = 16;
  let count = 0;
  let pause = false;

  let snake = {
    x: 160,
    y: 160,

    // snake velocity. moves one grid length every frame in either the x or y direction
    dx: grid,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    maxCells: 4,
  };
  const apple = {
    x: 320,
    y: 320,
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // game loop
  function loop() {
    requestAnimationFrame(loop);

    if (pause) {
      return;
    }
    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count < 4) {
      return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // move snake by it's velocity
    snake.x += snake.dx;
    snake.y += snake.dy;

    // wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
      snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
      snake.x = 0;
    }

    // wrap snake position vertically on edge of screen
    if (snake.y < 0) {
      snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
      snake.y = 0;
    }

    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
      snake.cells.pop();
    }

    // draw apple
    context.fillStyle = "red";
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // draw snake one cell at a time
    context.fillStyle = "green";
    snake.cells.forEach(function (cell, index) {
      // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
      context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

      // snake ate apple
      if (cell.x === apple.x && cell.y === apple.y) {
        snake.maxCells++;

        // canvas is 400x400 which is 25x25 grids
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }

      // check collision with all cells after this one (modified bubble sort)
      for (let i = index + 1; i < snake.cells.length; i++) {
        // snake occupies same space as a body part. reset game
        if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
          snake.x = 160;
          snake.y = 160;
          snake.cells = [];
          snake.maxCells = 4;
          snake.dx = grid;
          snake.dy = 0;

          apple.x = getRandomInt(0, 25) * grid;
          apple.y = getRandomInt(0, 25) * grid;
        }
      }
    });
  }

  // keyboard input
  document.addEventListener("keydown", function (e) {
    if (e.key == " ") {
      pause = !pause;
    }

    if (pause) return;

    if (e.key == "ArrowLeft" && snake.dx === 0) {
      snake.dx = -grid;
      snake.dy = 0;
    } else if (e.key == "ArrowRight" && snake.dx === 0) {
      snake.dx = grid;
      snake.dy = 0;
    } else if (e.key == "ArrowUp" && snake.dy === 0) {
      snake.dy = -grid;
      snake.dx = 0;
    } else if (e.key == "ArrowDown" && snake.dy === 0) {
      snake.dy = grid;
      snake.dx = 0;
    }
  });

  // start the game
  requestAnimationFrame(loop);
};
