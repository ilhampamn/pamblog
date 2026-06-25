<template>
  <div class="co-dots-loader" role="status" aria-label="Loading">
    <span class="co-dot" style="--i:0"></span>
    <span class="co-dot" style="--i:1"></span>
    <span class="co-dot" style="--i:2"></span>
  </div>
</template>

<style scoped>
@keyframes co-dot-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
  30%           { transform: translateY(-9px); opacity: 1; }
}

.co-dots-loader {
  display: flex;
  align-items: center;
  gap: 8px;
}

.co-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--loader-accent);
  animation: co-dot-bounce 1.2s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.2s);
}

@media (prefers-reduced-motion: reduce) {
  .co-dot { animation: none; opacity: 1; }
}
</style>
