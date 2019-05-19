<template>
  <div>
    <div class="controls">
      <input v-model="gridSize.x" placeholder="Grid x" /> x
      <input v-model="gridSize.y" placeholder="Grid y" />
      <button v-on:click="updateGrid()">Update</button>

      <div>
        <button v-on:click="toggleGame()">
          <span v-if="playing">
            Stop
          </span>
          <span v-else>
            Start
          </span>
        </button>

        <button v-on:click="clear()">Clear</button>
      </div>
    </div>

    <div class="stats">
      <p>Cycles {{ cycles }}</p>
      <p>Average cycle {{ averageCycle }} ms</p>
    </div>

    <div class="grid-container">
      <div class="row" v-for="(row, index) in grid.rows" v-bind:key="index">
        <cell v-for="(cell, index) in row" :cell="cell" v-bind:key="index" />
      </div>
    </div>
  </div>
</template>

<script>
import mean from 'lodash/mean'

import Cell from '@/components/Cell'

export default {
  name: 'Game',
  components: { Cell },
  data: function () {
    return {
      cycleInterval: null,
      gridSize: {
        x: 20,
        y: 20
      }
    }
  },
  computed: {
    grid () {
      return this.$store.state.grid
    },

    cycles () {
      return this.$store.state.cycleLog.length
    },

    averageCycle () {
      if (this.$store.state.cycleLog.length > 0) {
        var avg = mean(this.$store.state.cycleLog)
        return Math.round(avg * 100) / 100
      } else {
        return 0
      }
    },

    playing () {
      return this.cycleInterval !== null
    }
  },
  methods: {
    toggleGame () {
      if (this.playing) {
        this.stopGame()
      } else {
        this.startGame()
      }
    },

    stopGame () {
      clearInterval(this.cycleInterval)
      this.cycleInterval = null
    },

    startGame () {
      var self = this
      self.cycleInterval = setInterval(function () {
        self.$store.dispatch('cycle')
      }, 500)
    },

    updateGrid () {
      if (this.playing) {
        this.stopGame()
      }

      this.$store.dispatch('buildGrid', this.gridSize)
    },

    clear () {
      this.updateGrid()
      this.$store.commit('clearCycleLog')
    }
  },
  mounted: function () {
    this.$store.dispatch('buildGrid', this.gridSize)
  }
}
</script>

<style scoped lang="scss">
.grid-container{
  height: 100%;
  width: 100%;

  .row{
    margin: 0;
    padding: 0;
    border: 0;
    line-height: 0;
  }
}
</style>
