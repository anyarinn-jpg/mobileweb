<template>
  <ion-page>
    <ion-content class="profile-content">

      <!-- Background orbs -->
      <div class="bg-orb bg-orb--top"></div>
      <div class="bg-orb bg-orb--bottom"></div>

      <div class="profile-wrapper">

        <!-- Header -->
        <div class="profile-header">
          <div class="avatar-wrap">
            <img v-if="user?.photoUrl" :src="user.photoUrl" class="avatar-img" />
            <div v-else class="avatar-placeholder">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <div class="avatar-ring"></div>
          </div>

          <h1 class="display-name">{{ user?.displayName || 'Anonymous' }}</h1>
          <span class="uid-badge">{{ user?.uid ? shortUid(user.uid) : '—' }}</span>
        </div>

        <!-- Info card -->
        <div class="info-card" v-if="user">

          <div class="info-row">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <rect x="2" y="4" width="20" height="16" rx="3"/>
                <path d="M2 7l10 7 10-7"/>
              </svg>
            </div>
            <div class="info-body">
              <span class="info-label">Email</span>
              <span class="info-value">{{ user.email || '—' }}</span>
            </div>
          </div>

          <div class="divider-line"></div>

          <div class="info-row">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <div class="info-body">
              <span class="info-label">Phone</span>
              <span class="info-value">{{ user.phoneNumber || '—' }}</span>
            </div>
          </div>

          <div class="divider-line"></div>

          <div class="info-row">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <div class="info-body">
              <span class="info-label">Display name</span>
              <span class="info-value">{{ user.displayName || '—' }}</span>
            </div>
          </div>

          <div class="divider-line"></div>

          <div class="info-row">
            <div class="info-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <div class="info-body">
              <span class="info-label">UID</span>
              <span class="info-value uid-full">{{ user.uid }}</span>
            </div>
          </div>

        </div>

        <!-- Loading state -->
        <div class="loading-card" v-else>
          <div class="loading-shimmer"></div>
          <div class="loading-shimmer short"></div>
          <div class="loading-shimmer"></div>
        </div>

        <!-- Sign out button -->
        <button class="btn-signout" v-if="user" @click="signOut">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign out
        </button>

      </div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IonPage, IonContent } from "@ionic/vue";
import { useRouter } from "vue-router";
import { authService } from "@/auth/auth-service";

interface AuthUser {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoUrl?: string | null;
}

const user = ref<AuthUser | null>(null);
const router = useRouter();

onMounted(async () => {
  user.value = await authService.getCurrentUser();
});

const shortUid = (uid: string) => uid.slice(0, 8) + '…';

const signOut = async () => {
  try {
    await authService.logout?.();
    router.replace("/login");
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
/* ── Base ──────────────────────────────── */
.profile-content {
  --background: #faf5ff;
  --color: #1e1033;
  font-family: -apple-system, sans-serif;
}

/* ── Background orbs ───────────────────── */
.bg-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}
.bg-orb--top {
  width: 320px; height: 320px;
  top: -80px; right: -60px;
  background: radial-gradient(circle, #e9d5ff 0%, transparent 70%);
}
.bg-orb--bottom {
  width: 280px; height: 280px;
  bottom: -60px; left: -60px;
  background: radial-gradient(circle, #ddd6fe 0%, transparent 70%);
}

/* ── Wrapper ───────────────────────────── */
.profile-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 20px 40px;
  box-sizing: border-box;
}

/* ── Header ────────────────────────────── */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
  animation: fadeDown .4s ease both;
}

.avatar-wrap {
  position: relative;
  width: 96px; height: 96px;
  margin-bottom: 16px;
}
.avatar-img {
  width: 96px; height: 96px;
  border-radius: 50%;
  object-fit: cover;
  position: relative;
  z-index: 1;
}
.avatar-placeholder {
  width: 96px; height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9333ea, #7e22ce);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 24px rgba(147,51,234,.35);
}
.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c084fc, #9333ea, #ddd6fe);
  z-index: 0;
  animation: spin 6s linear infinite;
}
.avatar-ring::after {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: #faf5ff;
}
@keyframes spin { to { transform: rotate(360deg); } }

.display-name {
  font-size: 24px;
  font-weight: 700;
  color: #3b0764;
  margin: 0 0 8px;
  letter-spacing: -0.4px;
  font-family: 'Georgia', serif;
}
.uid-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #f3e8ff;
  color: #7e22ce;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .4px;
  border: 1px solid #e9d5ff;
}

/* ── Info card ─────────────────────────── */
.info-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 8px 0;
  box-shadow:
    0 4px 6px rgba(109,40,217,.05),
    0 20px 60px rgba(109,40,217,.12),
    inset 0 1px 0 rgba(255,255,255,.9);
  border: 1px solid rgba(233,213,255,.6);
  animation: fadeUp .4s .1s ease both;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
}
.info-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: #f3e8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9333ea;
  flex-shrink: 0;
}
.info-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.info-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: #c084fc;
  font-weight: 600;
}
.info-value {
  font-size: 15px;
  color: #3b0764;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.uid-full {
  font-size: 12px;
  font-family: 'Courier New', monospace;
  color: #7e22ce;
  letter-spacing: .3px;
}

.divider-line {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e9d5ff 20%, #e9d5ff 80%, transparent);
  margin: 0 20px;
}

/* ── Loading shimmer ───────────────────── */
.loading-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255,255,255,.75);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid rgba(233,213,255,.6);
}
.loading-shimmer {
  height: 18px;
  border-radius: 9px;
  background: linear-gradient(90deg, #f3e8ff 25%, #e9d5ff 50%, #f3e8ff 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.loading-shimmer.short { width: 60%; }
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Sign out ──────────────────────────── */
.btn-signout {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px 24px;
  background: white;
  color: #9333ea;
  border: 1.5px solid #e9d5ff;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s, transform .15s;
  animation: fadeUp .4s .2s ease both;
}
.btn-signout:hover {
  border-color: #c084fc;
  box-shadow: 0 0 0 3px rgba(192,132,252,.12);
}
.btn-signout:active { transform: scale(.97); }

/* ── Animations ────────────────────────── */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>