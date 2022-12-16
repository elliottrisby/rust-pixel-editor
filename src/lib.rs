use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, this uses `wee_alloc` as the global
// allocator.
//
// If you don't want to use `wee_alloc`, you can safely delete this.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub struct RGB {
    r: u8,
    g: u8,
    b: u8,
}

#[wasm_bindgen]
pub struct Image {
    width: usize,
    height: usize,
    cells: Vec<RGB>, // e.g; [{0, 0, 0}, {0, 0, 0}, {0, 0, 0}],
}

#[wasm_bindgen]
impl Image {
    #[wasm_bindgen(constructor)]
    pub fn new(width: usize, height: usize) -> Image {
        let mut cells = Vec::new();
        cells.resize_with(width * height, || RGB {
            r: 255,
            g: 255,
            b: 255,
        });

        Image {
            width,
            height,
            cells,
        }
    }

    #[wasm_bindgen]
    pub fn width(&self) -> usize {
        self.width
    }

    #[wasm_bindgen]
    pub fn height(&self) -> usize {
        self.height
    }

    #[wasm_bindgen]
    pub fn cells(&self) -> Vec<u8> {
        let cells = self
            .cells
            .iter()
            .map(|rgb| vec![rgb.r, rgb.g, rgb.b])
            .collect::<Vec<Vec<u8>>>()
            .concat(); // e.g; [0, 0, 0, 0, 0, 0, 0, 0, 0]

        cells
    }

    #[wasm_bindgen]
    pub fn brush(&mut self, x: usize, y: usize, color: Vec<u8>) {
        let index = y * self.width + x;
        self.cells[index] = RGB {
            r: color[0],
            g: color[1],
            b: color[2],
        };
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        // just map over the cells and reset them to white
        self.cells = self
            .cells
            .iter()
            .map(|_| RGB {
                r: 255,
                g: 255,
                b: 255,
            })
            .collect();
    }
}
