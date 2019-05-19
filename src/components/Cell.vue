<template>
  <div class="cell" v-bind:class="style" v-on:click="toggle()">
  </div>
</template>

<script>
import clone from 'lodash/clone'

export default {
  name: 'Cell',
  props: ['cell'],
  computed: {
    style () {
      return {
        dead: !this.cell.alive,
        living: this.cell.alive,
        'alive-before': !this.cell.alive && this.cell.aliveBefore
      }
    }
  },
  methods: {
    toggle () {
      var copy = clone(this.cell)
      copy.alive = !copy.alive

      this.$store.commit('updateCell', copy)
    }
  }
}
</script>

<style scoped lang="scss">
.cell{
  width: 25px;
  height: 25px;
  border: 1px solid #E0E0E0;
  display: inline-block;
  cursor: pointer;
}

.cell:hover{
  background: #EDEDED;
}

.living{
  background: #A1A1A1;
}

.dead{
  background: #FFFFFF;
}

.alive-before{
  background: #F7F3F3
}
</style>
