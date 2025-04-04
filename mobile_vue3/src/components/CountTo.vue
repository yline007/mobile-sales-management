<template>
  <span>{{ displayValue }}</span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 1000
  }
})

const displayValue = ref(0)
const startTime = ref(null)
const startValue = ref(0)
const endValue = ref(0)

const startAnimation = () => {
  startValue.value = displayValue.value
  endValue.value = props.value
  startTime.value = Date.now()

  function animate() {
    const now = Date.now()
    const elapsed = now - startTime.value
    if (elapsed > props.duration) {
      displayValue.value = props.value
      return
    }

    const progress = elapsed / props.duration
    const easedProgress = -(Math.cos(Math.PI * progress) - 1) / 2
    displayValue.value = Math.round(startValue.value + (endValue.value - startValue.value) * easedProgress)
    
    requestAnimationFrame(animate)
  }
  
  requestAnimationFrame(animate)
}

watch(() => props.value, (newValue) => {
  startAnimation()
})

onMounted(() => {
  displayValue.value = 0
  startAnimation()
})
</script>