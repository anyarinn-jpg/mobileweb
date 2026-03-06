<template>
  <ion-page>
    <ion-header class="header-glass">
      <ion-toolbar>
        <ion-title class="header-title">
          <span class="title-icon">🌙</span> ARM WORKOUT
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :scroll-y="false" class="workout-content">
      <div class="stars"></div>
      <div class="stars stars-2"></div>
      <div class="bg-glow"></div>
      <div class="bg-ring bg-ring-1"></div>
      <div class="bg-ring bg-ring-2"></div>
      <div class="bg-ring bg-ring-3"></div>

      <div class="main-container">

        <!-- Rep Counter Circle -->
        <div class="rep-circle-wrapper">
          <svg class="progress-svg" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#a78bfa" />
                <stop offset="100%" stop-color="#60a5fa" />
              </linearGradient>
            </defs>
            <circle class="track-circle" cx="100" cy="100" r="85" />
            <circle
              class="progress-circle"
              cx="100" cy="100" r="85"
              :stroke-dashoffset="dashOffset"
            />
          </svg>
          <div class="rep-inner">
            <span class="rep-label">REPS</span>
            <span class="rep-number">{{ state?.repDisplay ?? 0 }}</span>
            <span class="rep-unit">ครั้ง</span>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-icon">🏆</span>
            <span class="stat-value">{{ state?.stats?.score ?? 0 }}</span>
            <span class="stat-label">คะแนน</span>
          </div>
          <div class="stat-card stat-card-center">
            <span class="stat-icon">🌟</span>
            <span class="stat-value">{{ sessionReps }}</span>
            <span class="stat-label">เซสชัน</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon">💫</span>
            <span class="stat-value">{{ isRunning ? 'ON' : 'OFF' }}</span>
            <span class="stat-label">สถานะ</span>
          </div>
        </div>

        <!-- Message Banner -->
        <div class="message-banner" :class="{ 'message-active': !!state?.stats?.lastMessage }">
          <span class="message-dot"></span>
          <span class="message-text">{{ state?.stats?.lastMessage || 'พร้อมเริ่มออกกำลังกาย...' }}</span>
        </div>

        <!-- Buttons -->
        <div class="button-group">
          <button class="btn-start" :class="{ 'btn-pulse': isRunning }" @click="start" :disabled="isRunning">
            <span class="btn-icon">▶</span>
            <span class="btn-text">เริ่ม</span>
          </button>
          <button class="btn-stop" @click="stop" :disabled="!isRunning">
            <span class="btn-icon">■</span>
            <span class="btn-text">หยุด</span>
          </button>
        </div>

      </div>
    </ion-content>

    <ion-footer class="footer-bar">
      <div class="footer-text">673380023-2 นางสาวอัญรินทร์ นิธิโพธิพงศ์</div>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);
const isRunning = ref(false);
const sessionReps = ref(0);

const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();

const dashOffset = computed(() => {
  const circumference = 2 * Math.PI * 85;
  const reps = state.value?.repDisplay ?? 0;
  const progress = Math.min((reps % 20) / 20, 1);
  return circumference * (1 - progress);
});

// Track last spoken message to avoid repeating
let lastSpokenMessage = "";
let ttsDebounce: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  engine.onChange((s) => {
    state.value = s;
    sessionReps.value = s.repDisplay ?? 0;

    const msg = s.stats?.lastMessage ?? "";
    const isSpeedWarning =
      msg.includes("เร็ว") || msg.includes("ช้า") ||
      msg.toLowerCase().includes("fast") || msg.toLowerCase().includes("slow");

    if (isSpeedWarning && msg !== lastSpokenMessage) {
      lastSpokenMessage = msg;
      // Debounce: ไม่พูดซ้ำถี่เกิน 2 วินาที
      if (ttsDebounce) clearTimeout(ttsDebounce);
      ttsDebounce = setTimeout(async () => {
        await tts.speak(msg);
      }, 300);
    }
  });
});

async function start() {
  if (isRunning.value) return;
  isRunning.value = true;
  await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง");
  engine.start();
  await motion.start((s) => engine.process(s));
}

async function stop() {
  if (!isRunning.value) return;
  await motion.stop();
  engine.stop();
  isRunning.value = false;
  lastSpokenMessage = "";
  if (ttsDebounce) clearTimeout(ttsDebounce);
}
</script>

<style scoped>
/* ─── Night Mode Theme ───────────────────────────── */

ion-page {
  background: #050714;
  font-family: 'Segoe UI', 'Noto Sans Thai', sans-serif;
}

.workout-content {
  --background: #050714;
  --color: #000000;
  overflow: hidden;
}

/* ─── Header ────────────────────────────────────── */
.header-glass ion-toolbar {
  --background: rgba(5, 7, 20, 0.85);
  --border-color: rgba(167, 139, 250, 0.2);
  --border-width: 0 0 1px 0;
  backdrop-filter: blur(16px);
}

.header-title {
  --color: #000000;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.title-icon { margin-right: 6px; }

/* ─── Stars ─────────────────────────────────────── */
.stars, .stars-2 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1px 1px at 25% 40%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 40% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 55% 30%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(1px 1px at 70% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 80% 50%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 15% 70%, rgba(255,255,255,0.3) 0%, transparent 100%),
    radial-gradient(1px 1px at 60% 75%, rgba(255,255,255,0.4) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 35% 85%, rgba(255,255,255,0.3) 0%, transparent 100%);
  animation: twinkle 4s ease-in-out infinite alternate;
}

.stars-2 {
  background-image:
    radial-gradient(1px 1px at 20% 25%, rgba(167,139,250,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 45% 55%, rgba(96,165,250,0.4) 0%, transparent 100%),
    radial-gradient(1.5px 1.5px at 65% 15%, rgba(167,139,250,0.5) 0%, transparent 100%),
    radial-gradient(1px 1px at 85% 35%, rgba(96,165,250,0.3) 0%, transparent 100%),
    radial-gradient(1px 1px at 5%  60%, rgba(167,139,250,0.4) 0%, transparent 100%),
    radial-gradient(1px 1px at 75% 80%, rgba(96,165,250,0.3) 0%, transparent 100%);
  animation: twinkle 6s ease-in-out infinite alternate-reverse;
}

@keyframes twinkle {
  0%   { opacity: 0.5; }
  100% { opacity: 1;   }
}

/* ─── Background Glow & Rings ───────────────────── */
.bg-glow {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(109, 40, 217, 0.14) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.bg-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.bg-ring-1 { width: 500px; height: 500px; border: 1px solid rgba(167, 139, 250, 0.06); }
.bg-ring-2 { width: 380px; height: 380px; border: 1px solid rgba(96, 165, 250, 0.05);  }
.bg-ring-3 { width: 260px; height: 260px; border: 1px solid rgba(167, 139, 250, 0.08); }

/* ─── Main Layout ───────────────────────────────── */
.main-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 28px 20px 16px;
  height: 100%;
}

/* ─── Rep Circle ────────────────────────────────── */
.rep-circle-wrapper {
  position: relative;
  width: 210px;
  height: 210px;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.track-circle {
  fill: none;
  stroke: rgba(167, 139, 250, 0.1);
  stroke-width: 8;
}

.progress-circle {
  fill: none;
  stroke: url(#moonGrad);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 534;
  transition: stroke-dashoffset 0.5s ease;
  filter: drop-shadow(0 0 10px rgba(167, 139, 250, 0.65));
}

.rep-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.rep-label {
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: #000000;
  font-weight: 700;
  text-transform: uppercase;
}

.rep-number {
  font-size: 3.8rem;
  font-weight: 900;
  color: #000000;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-shadow: none;
}

.rep-unit {
  font-size: 0.8rem;
  color: rgba(0, 0, 0, 0.45);
}

/* ─── Stats Row ─────────────────────────────────── */
.stats-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(167, 139, 250, 0.12);
  border-radius: 16px;
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(8px);
}

.stat-card-center {
  background: rgba(167, 139, 250, 0.08);
  border-color: rgba(0, 0, 0, 0.3);
}

.stat-icon { font-size: 1.2rem; }

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #000000;
}

.stat-label {
  font-size: 0.65rem;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0.05em;
}

/* ─── Message Banner ────────────────────────────── */
.message-banner {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(167, 139, 250, 0.12);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: border-color 0.3s, background 0.3s;
  backdrop-filter: blur(8px);
}

.message-banner.message-active {
  border-color: rgba(167, 139, 250, 0.45);
  background: rgba(167, 139, 250, 0.06);
}

.message-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(167, 139, 250, 0.25);
  flex-shrink: 0;
  transition: background 0.3s;
}

.message-banner.message-active .message-dot {
  background: #a78bfa;
  box-shadow: 0 0 8px rgba(167, 139, 250, 0.9);
  animation: blink 1.4s ease infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

.message-text {
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.55);
  line-height: 1.4;
}

/* ─── Buttons ───────────────────────────────────── */
.button-group {
  display: flex;
  gap: 14px;
  width: 100%;
}

.btn-start, .btn-stop {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.btn-start {
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border: none;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.45);
}

.btn-start:disabled {
  opacity: 0.3;
  box-shadow: none;
  cursor: default;
}

.btn-start:not(:disabled):active {
  transform: scale(0.96);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
}

.btn-start.btn-pulse:not(:disabled) {
  animation: pulse-glow 2s ease infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 8px 24px rgba(124, 58, 237, 0.45); }
  50%       { box-shadow: 0 8px 40px rgba(124, 58, 237, 0.75), 0 0 60px rgba(96, 165, 250, 0.2); }
}

.btn-stop {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(167, 139, 250, 0.2);
  color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
}

.btn-stop:disabled {
  opacity: 0.25;
  cursor: default;
}

.btn-stop:not(:disabled):active {
  transform: scale(0.96);
  background: rgba(167, 139, 250, 0.1);
  border-color: rgba(167, 139, 250, 0.5);
  color: #000000;
}

.btn-icon { font-size: 0.9rem; }
.btn-text  { font-size: 1rem; }

/* ─── Footer ────────────────────────────────────── */
.footer-bar {
  --background: rgba(5, 7, 20, 0.9);
  border-top: 1px solid rgba(167, 139, 250, 0.08);
  padding: 10px 20px;
}

.footer-text {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.3);
  text-align: center;
  letter-spacing: 0.05em;
}
</style>