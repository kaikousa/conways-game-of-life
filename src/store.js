import Vue from 'vue'
import Vuex from 'vuex'
import filter from 'lodash/filter'
import clone from 'lodash/clone'
import forEach from 'lodash/forEach'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    grid: [],
    cycleLog: []
  },
  mutations: {
    setGrid (state, grid) {
      state.grid = grid
    },

    addCycleLog (state, cycle) {
      state.cycleLog.push(cycle)
    },

    updateCell (state, cell) {
      Object.assign(state.grid.rows[cell.row][cell.cell], cell)
    }
  },
  actions: {
    buildGrid (context) {
      var grid = {
        x: 20,
        y: 20,
        rows: []
      }

      for (var x = 0; x < grid.x; x++) {
        grid.rows[x] = []
        for (var y = 0; y < grid.y; y++) {
          grid.rows[x][y] = {
            row: x,
            cell: y,
            alive: false
          }
        }
      }

      context.commit('setGrid', grid)
    },

    cycle (context) {
      var start = new Date()

      var transitions = []

      // Sweep through the grid and determine next states for each cell
      for (var y = 0; y < context.state.grid.rows.length; y++) {
        var row = context.state.grid.rows[y]
        for (var x = 0; x < row.length; x++) {
          var cell = row[x]
          var alive = liveNeighbours(context.state.grid, cell)

          if (cell.alive) {
            if (alive.length < 2 || alive.length > 3) {
              // dies of underpopulation or overpopulation
              transitions.push({
                cell: cell,
                alive: false
              })
            }
          } else {
            if (alive.length === 3) {
              // becomes alive from reproduction
              transitions.push({
                cell: cell,
                alive: true
              })
            }
          }
        }
      }

      // Transition state between life-death
      forEach(transitions, (t) => {
        var copy = clone(t.cell)
        copy.alive = t.alive
        context.commit('updateCell', copy)
      })

      var end = new Date()

      context.commit('addCycleLog', end - start)
    }
  }
})

function createNeighbour (cell, rowModifier, cellModifier) {
  return {
    row: cell.row + rowModifier,
    cell: cell.cell + cellModifier
  }
}

// Filter neighbours that are out of bounds
function validateNeighbours (grid, neighbours) {
  return filter(neighbours, (o) => {
    return o.cell >= 0 && o.row >= 0 && o.row < grid.y && o.cell < grid.x
  })
}

function filterDead (grid, neighbours) {
  // TODO: there is one undefined for some reason
  if (neighbours === undefined) {
    return []
  }
  return filter(neighbours, (o) => {
    var neighbour = grid.rows[o.row][o.cell]
    return neighbour.alive
  })
}

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
  return validateNeighbours(grid, neighbours)
}
