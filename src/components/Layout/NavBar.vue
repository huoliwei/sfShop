<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title?: string
  leftArrow?: boolean
  leftText?: string
  rightText?: string
  fixed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  leftArrow: true,
  leftText: '',
  rightText: '',
  fixed: false,
})

const emit = defineEmits<{
  clickLeft: []
  clickRight: []
}>()

const router = useRouter()

const onClickLeft = () => {
  emit('clickLeft')
  if (props.leftArrow) {
    router.back()
  }
}

const onClickRight = () => {
  emit('clickRight')
}
</script>

<template>
  <van-nav-bar
    :title="title"
    :left-arrow="leftArrow"
    :left-text="leftText"
    :right-text="rightText"
    :fixed="fixed"
    :placeholder="fixed"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #left v-if="$slots.left">
      <slot name="left"></slot>
    </template>
    <template #right v-if="$slots.right">
      <slot name="right"></slot>
    </template>
  </van-nav-bar>
</template>

<style scoped>
/* NavBar 样式已在 theme.css 中定义 */
</style>
