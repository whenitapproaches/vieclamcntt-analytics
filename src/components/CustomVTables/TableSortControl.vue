  <template>
	<span v-if="props.sortable" class="icon is-pulled-right" :class="sort">
    <base-icon>unfold_more</base-icon>
  </span>
</template>

<script>
export default {
	name: "TableSortControl",
  props: ["props"],
  computed: {
    icon() {
      let arr = this.props.class.split(" ")
      return [arr[2], arr[3]]
    },
    sort() {
      let arr = this.props.class.split(" ")
      return arr[3]
    }
  }
}
</script>

<style lang="scss" scoped>
span.icon {
  color: var(--text-secondary-color);
  &.sort-up, &.sort-down {
    color: var(--text-primary-color);
  }
}
</style>