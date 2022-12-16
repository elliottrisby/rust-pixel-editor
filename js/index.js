const CELL_SIZE = 20;

function draw(state) {
  const gridWidth = state.image.width();
  const gridHeight = state.image.height();

  const cells = state.image.cells();

  // draw the cells
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (state.showGrid) {
        state.ctx.strokeStyle = "#0B31B7"; // blue
        state.ctx.strokeRect(
          x * CELL_SIZE,
          y * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      }

      // get the index every 3 cells
      const index = (x + y * gridWidth) * 3;

      // paint the cell at the given index with the given color
      state.ctx.fillStyle = `rgb(${cells[index]}, ${cells[index + 1]}, ${
        cells[index + 2]
      })`;

      state.ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function setupCanvas(state) {
  const { canvas, ctx } = state;

  // adjust canvas for retina
  const dpr = window.devicePixelRatio || 1;

  // initialize canvas size
  canvas.width = state.image.width() * CELL_SIZE * dpr;
  canvas.height = state.image.height() * CELL_SIZE * dpr;

  // scale the canvas
  canvas.style.width = `${canvas.width / dpr}px`;
  canvas.style.height = `${canvas.height / dpr}px`;

  const rect = canvas.getBoundingClientRect();

  ctx.scale(dpr, dpr);

  // add event listener for mouse clicks
  canvas.addEventListener("click", function (event) {
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // convert to pixel space
    x = Math.floor(x / CELL_SIZE);
    y = Math.floor(y / CELL_SIZE);

    console.log(`x: ${x}, y: ${y}`, state.currentColor);

    // set the color of the cell at the given coordinates
    state.image.brush(x, y, state.currentColor);

    // redraw the canvas
    draw(state);
  });

  // when mousing over canvas change cursor to crosshair
  canvas.addEventListener("mouseover", function (event) {
    canvas.style.cursor = "crosshair";
  });

  // paint canvas when mouse down and moving across the canvas
  canvas.addEventListener("mousemove", function (event) {
    // left click
    if (event.buttons === 1) {
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;

      // convert to pixel space
      x = Math.floor(x / CELL_SIZE);
      y = Math.floor(y / CELL_SIZE);

      console.log(`x: ${x}, y: ${y}`, state.currentColor);

      // set the color of the cell at the given coordinates
      state.image.brush(x, y, state.currentColor);

      // redraw the canvas
      draw(state);
    }
  });

  // add event listeners for color swatches
  document.getElementById("pink").addEventListener("click", () => {
    state.currentColor = [255, 109, 162];
  });

  document.getElementById("blue").addEventListener("click", () => {
    state.currentColor = [0, 0, 255];
  });

  document.getElementById("black").addEventListener("click", () => {
    state.currentColor = [0, 0, 0];
  });

  document.getElementById("btn-clear").addEventListener("click", () => {
    state.image.clear();
    draw(state);
  });

  document.getElementById("btn-grid").addEventListener("click", () => {
    state.showGrid = !state.showGrid;
    draw(state);
  });
}

(async function main() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const lib = await import("../pkg/index.js").catch(console.error);

  const image = new lib.Image(30, 30);

  const state = {
    canvas,
    ctx,
    image,
    currentColor: [255, 109, 162],
    showGrid: false,
  };

  setupCanvas(state);

  draw(state);
})();
