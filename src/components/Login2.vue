<template>
  <div class="lane" :class="{ mirrored }" :style="laneVars">
    <div class="strip">
      <!-- 2 tiles so it loops seamlessly -->
      <div class="tile" v-for="n in 2" :key="n">
        <div
          v-for="(item, i) in pattern"
          :key="`${n}-${i}`"
          class="item"
          :style="itemStyle(item)"
        >
          <!-- Unmirror the SVG so only the pattern is mirrored -->
          <component :is="item.component" class="w-full h-full" :class="item.class" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  pattern: { type: Array, required: true },
  duration: { type: Number, default: 9 },   // seconds
  tileWidth: { type: Number, default: 520 },// px (spacing per loop)
  mirrored: { type: Boolean, default: false },
})

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function itemStyle(item) {
  const x = item.x ?? 0        // percent within tile
  const y = item.y ?? 50       // percent within lane height
  const rot = clamp(item.rot ?? 0, -45, 45)
  const scale = item.scale ?? 1
  const opacity = item.opacity ?? 0.5
  const size = item.size ?? 44 // px

  return {
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    opacity,
    transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
  }
}

const laneVars = {
  "--dur": `${props.duration}s`,
  "--tileW": `${props.tileWidth}px`,
}
</script>

<style scoped>
/* lane sits behind bars; parent must be relative */
.lane {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;

  /* match your "behind bars" vertical placement */
  transform: translateY(50%);
  height: 50%;

  overflow: visible;
}

/* Mirror the whole motion/pattern for the right side */
.lane.mirrored {
  transform: translateY(50%) scaleX(-1);
}

/* Strip moves left->right; mirrored lane makes it appear right->left */
.strip {
  position: relative;
  height: 100%;
  width: max-content;
  display: flex;

  animation: drift var(--dur) linear infinite;
  will-change: transform;
}

/* One repeating tile */
.tile {
  position: relative;
  width: var(--tileW);
  height: 100%;
  flex: 0 0 auto;
}

/* Each icon */
.item {
  position: absolute;
  will-change: transform, opacity;
}

/* Unmirror the SVG content itself so it doesn't flip */
.lane.mirrored .item > :deep(*) {
  transform: scaleX(-1);
}

@keyframes drift {
  /* Start far enough left that icons are behind bars, then approach center */
  from { transform: translateX(-50%); }
  to   { transform: translateX(0%); }
}
</style>