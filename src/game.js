import filter from 'lodash/filter'

export function buildGrid (maxX, maxY) {
  var grid = {
    x: maxX,
    y: maxY,
    rows: []
  }

  for (var x = 0; x < grid.x; x++) {
    grid.rows[x] = []
    for (var y = 0; y < grid.y; y++) {
      grid.rows[x][y] = {
        row: x,
        cell: y,
        alive: false,
        aliveBefore: false
      }
    }
  }

  return grid
}

// Cycle through the grid and resolve the next generation of cells.
// Returns an array of state transitions to be applied.
export function cycle (grid) {
  var transitions = []

  // Sweep through the grid and determine next states for each cell
  for (var y = 0; y < grid.rows.length; y++) {
    var row = grid.rows[y]
    for (var x = 0; x < row.length; x++) {
      var cell = row[x]
      var alive = liveNeighbours(grid, cell)

      if (cell.alive) {
        // dies of underpopulation or overpopulation
        if (alive.length < 2 || alive.length > 3) {
          transitions.push({
            cell: cell,
            alive: false
          })
        }
      } else {
        // becomes alive from reproduction
        if (alive.length === 3) {
          transitions.push({
            cell: cell,
            alive: true
          })
        }
      }
    }
  }

  return transitions
}

// Returns the living neighbours of a given cell.
function liveNeighbours (grid, cell) {
  return filterDead(
    grid,
    neighbours(grid, cell)
  )
}

function neighbours (grid, cell) {
  var neighbours = [
    createNeighbour(cell, -1, 0), // top
    createNeighbour(cell, 1, 0), // bottom
    createNeighbour(cell, 0, -1), // left
    createNeighbour(cell, 0, 1), // right
    createNeighbour(cell, -1, -1), // topLeft
    createNeighbour(cell, -1, 1), // topRight
    createNeighbour(cell, 1, -1), // bottomLeft
    createNeighbour(cell, 1, 1) // bottomRight
  ]
  return filterOutOfBounds(grid, neighbours)
}

function createNeighbour (cell, rowModifier, cellModifier) {
  return {
    row: cell.row + rowModifier,
    cell: cell.cell + cellModifier
  }
}

// Filter neighbours that are out of bounds of the grid dimensions
function filterOutOfBounds (grid, neighbours) {
  return filter(neighbours, (o) => {
    return o.cell >= 0 && o.row >= 0 && o.row < grid.y && o.cell < grid.x
  })
}

function filterDead (grid, neighbours) {
  return filter(neighbours, (o) => {
    var neighbour = grid.rows[o.row][o.cell]
    return neighbour.alive
  })
}
