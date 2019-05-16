<template>
  <div class="grid-container">
    <div class="row" v-for="(row, index) in grid.rows" v-bind:key="index">
      <cell v-for="(cell, index) in row" :cell="cell" v-bind:key="index" />
    </div>

    <div class="controls">
      <button v-on:click="toggleGame()">
        <span v-if="playing">
          Stop
        </span>
        <span v-else>
          Start
        </span>
      </button>

      <button v-on:click="cycle()">Cycle</button>
    </div>

    <div class="stats">
      <p>Cycles {{ cycles }}</p>
      <p>Average cycle {{ averageCycle }} ms</p>
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
      cycleInterval: null
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
        return mean(this.$store.state.cycleLog)
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
      if (this.cycleInterval) {
        clearInterval(this.cycleInterval)
      } else {
        var self = this
        setInterval(function () {
          self.cycleInterval = self.$store.dispatch('cycle')
        }, 1000)
      }
    },

    cycle () {
      this.$store.dispatch('cycle')
    }
  },
  mounted: function () {
    this.$store.dispatch('buildGrid')
  }
}
</script>

<style scoped lang="scss">
.grid-container{
  height: 100%;
  width: 100%;
}

.row{
  margin: 0;
  padding: 0;
  border: 0;
  line-height: 0;
}
</style>
