<template>
	<tbody>
		<vnodes :vnodes="props.slots.prependBody" />
		<vt-no-results-row v-if="props.data.length === 0" />
		<template v-for="(row,index) in props.data">
			<vt-table-row
				:class="{'is-last': index == props.data.length - 1}"
				:key="`row${index}`"
				:row="row"
				:index="props.initialIndex + index + 1"
			></vt-table-row>
			<transition
				:key="`childRowTransition${index}`"
				@before-enter="beforeEnter"
				@enter="enter"
				@enter-cancelled="enterCancelled"
				@leave="leave"
			>
				<vt-child-row
					:key="`childRow${index}`"
					:row="row"
					v-show="props.openChildRows.includes(row[props.uniqueRowId])"
					:class="{'is-opened': props.openChildRows.includes(row[props.uniqueRowId])}"
				></vt-child-row>
			</transition>
		</template>
		<!-- <table-rows
			v-for="(row,index) in props.data"
			:row="row"
			:index="props.initialIndex + index + 1"
			:renderChildRow="props.hasChildRow"
			:showChildRow="props.openChildRows.includes(row[props.uniqueRowId])"
			:key="index"
		/>-->
		<vnodes :vnodes="props.slots.appendBody" />
	</tbody>
</template>

<script>
import VtNoResultsRow from "vue-tables-2/compiled/components/VtNoResultsRow"
import VtTableRow from "vue-tables-2/compiled/components/VtTableRow"
import VtChildRow from "vue-tables-2/compiled/components/VtChildRow"
import anime from "animejs/lib/anime.es"
export default {
	name: "TableBody",
	props: ["props"],
	components: {
		VtNoResultsRow,
		VtTableRow,
		VtChildRow,
		vnodes: {
			functional: true,
			render: (h, ctx) => ctx.props.vnodes
		}
	},
	methods: {
		// --------
		// ENTERING
		// --------

		beforeEnter: function(el) {
			el.style.height = 0
		},
		// the done callback is optional when
		// used in combination with CSS
		enter: function(el, done) {
			let child = el.querySelector('.childRow__content')
			let height = getComputedStyle(child).height
			anime({
				targets: el,
				height: height,
				easing: "linear",
				duration: 200,
				complete: done
			})
		},
		enterCancelled: function(el) {
			anime({
				targets: el,
				height: "0",
				easing: "linear",
				duration: 200
			})
		},
		leave: function(el, done) {
			anime({
				targets: el,
				height: "0",
				easing: "linear",
				duration: 200,
				complete: done
			})
		}
	}
}
</script>