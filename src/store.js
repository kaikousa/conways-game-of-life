import Vue from 'vue'
import Vuex from 'vuex'
import clone from 'lodash/clone'
import forEach from 'lodash/forEach'
import * as game from '@/game'

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
    buildGrid (context, gridSize) {
      var grid = game.buildGrid(gridSize.x, gridSize.y)

      context.commit('setGrid', grid)
    },

    cycle (context) {
      var start = new Date()

      var transitions = game.cycle(context.state.grid)

      // Transition state between life-death
      forEach(transitions, (t) => {
        var copy = clone(t.cell)
        if (copy.alive) {
          copy.aliveBefore = true
        }
        copy.alive = t.alive
        context.commit('updateCell', copy)
      })

      var end = new Date()

      context.commit('addCycleLog', end - start)
    }
  }
})
