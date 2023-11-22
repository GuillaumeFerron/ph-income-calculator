<template>
  <button
    :class="`btn font-ProximaNova-SemiBold w-100 ${clicked ? 'clicked' : ''} ${!isClickable ? 'disabled' : ''} ${colorTheme}`"
    :disabled="!isClickable" @click="buttonClick">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'TpButton',
  props: {
    colorTheme: {
      type: String,
      default: 'primary'
    },
    isClickable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      clicked: false
    }
  },
  methods: {
    buttonClick() {
      if (this.isClickable) {
        this.clicked = true
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_colors.scss';

.btn {
  font-size: 14px;
  border-style: solid;
  border-width: 2px;
  border-radius: 5px;

  &.primary {
    background-color: $tp-primary;
    color: $white;
    border-color: $tp-primary;

    &.clicked {
      background-color: $white;
      color: $tp-primary;
      border-color: $tp-primary;
    }
  }

  &.secondary {
    background-color: $tp-secondary;
    color: $black;
    border-color: $tp-secondary;

    &.clicked {
      background-color: $white;
      color: $black;
      border-color: $tp-secondary;
    }
  }

  &.disabled {
    background-color: $grey-300;
    color: $grey-400;
    border-color: $grey-300;
  }
}</style>
