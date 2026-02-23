<template>
  <ion-page>
    <ion-content class="login-content">

      <!-- Background decorations -->
      <div class="bg-orb bg-orb--top"></div>
      <div class="bg-orb bg-orb--bottom"></div>

      <div class="login-wrapper">

        <!-- Logo / Header -->
        <div class="login-header">
          <div class="logo-mark">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="18" fill="url(#grad)"/>
              <path d="M11 18C11 14.134 14.134 11 18 11C21.866 11 25 14.134 25 18" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="18" cy="23" r="3" fill="white"/>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stop-color="#9333ea"/>
                  <stop offset="100%" stop-color="#6d28d9"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="login-title">Welcome back</h1>
          <p class="login-subtitle">Sign in to continue</p>
        </div>

        <!-- Card -->
        <div class="login-card">

          <!-- Tab switcher -->
          <div class="tab-switcher">
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'email' }"
              @click="activeTab = 'email'"
            >Email</button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'phone' }"
              @click="activeTab = 'phone'"
            >Phone</button>
            <div class="tab-slider" :class="{ right: activeTab === 'phone' }"></div>
          </div>

          <!-- EMAIL TAB -->
          <div v-if="activeTab === 'email'" class="tab-content">
            <div class="field-group">
              <label class="field-label">Email address</label>
              <div class="field-wrap">
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="3"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
                <ion-input
                  v-model="email"
                  placeholder="you@example.com"
                  type="email"
                  class="custom-input"
                />
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">Password</label>
              <div class="field-wrap">
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <rect x="5" y="11" width="14" height="10" rx="2"/>
                  <path d="M8 11V7a4 4 0 018 0v4"/>
                </svg>
                <ion-input
                  v-model="password"
                  placeholder="••••••••"
                  type="password"
                  class="custom-input"
                />
              </div>
            </div>

            <button class="btn-primary" @click="loginEmail">
              <span>Sign in</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>

            <div class="divider"><span>or</span></div>

            <button class="btn-google" @click="loginGoogle">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <!-- PHONE TAB -->
          <div v-if="activeTab === 'phone'" class="tab-content">
            <div class="field-group">
              <label class="field-label">Phone number</label>
              <div class="field-wrap">
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <ion-input
                  v-model="phone"
                  placeholder="+66 812 345 678"
                  type="tel"
                  class="custom-input"
                />
              </div>
            </div>

            <button class="btn-primary" @click="sendOtp" :disabled="loading">
              <span>{{ loading ? 'Sending…' : 'Send OTP' }}</span>
              <svg v-if="!loading" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
              <div v-else class="spinner"></div>
            </button>

            <!-- OTP section -->
            <transition name="slide-up">
              <div v-if="showOtp" class="otp-section">
                <p class="otp-hint">Enter the 6-digit code sent to <strong>{{ phone }}</strong></p>
                <div class="field-group">
                  <div class="field-wrap">
                    <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <ion-input
                      v-model="otp"
                      placeholder="123456"
                      type="number"
                      class="custom-input otp-input"
                    />
                  </div>
                </div>
                <button class="btn-primary" @click="confirmOtp">
                  <span>Verify & Sign in</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </button>
              </div>
            </transition>
          </div>

        </div>

        <p class="footer-note">By continuing, you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy</a></p>

      </div>

      <div id="recaptcha-container"></div>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IonPage, IonContent, IonInput } from "@ionic/vue";
import { useRouter } from "vue-router";
import { authService } from "@/auth/auth-service";
import { getRecaptchaVerifier } from "@/auth/auth-web";

const router = useRouter();

const activeTab = ref<'email' | 'phone'>('email');

const email = ref("");
const password = ref("");
const phone = ref("+66123456789");
const otp = ref("");
const verificationId = ref("");
const showOtp = ref(false);
const loading = ref(false);

onMounted(() => {
  getRecaptchaVerifier("recaptcha-container");
});

const loginEmail = async () => {
  try {
    await authService.loginWithEmailPassword({ email: email.value, password: password.value });
    router.replace("/tabs/tab1");
  } catch (err) { console.error(err); }
};

const loginGoogle = async () => {
  try {
    await authService.loginWithGoogle();
    router.replace("/tabs/tab1");
  } catch (err: any) {
    if (err.code !== "auth/popup-closed-by-user") console.error(err);
  }
};

const sendOtp = async () => {
  loading.value = true;
  try {
    const result = await authService.startPhoneLogin({ phoneNumberE164: phone.value });
    verificationId.value = result.verificationId;
    showOtp.value = true;
  } catch (err) { console.error(err); }
  finally { loading.value = false; }
};

const confirmOtp = async () => {
  try {
    await authService.confirmPhoneCode({ verificationId: verificationId.value, verificationCode: otp.value });
    router.replace("/tabs/tab1");
  } catch (err) { console.error(err); }
};
</script>

<style scoped>
/* ── Variables ─────────────────────────── */
:root {
  --p50:  #faf5ff;
  --p100: #f3e8ff;
  --p200: #e9d5ff;
  --p400: #c084fc;
  --p600: #9333ea;
  --p700: #7e22ce;
  --p800: #6b21a8;
}

/* ── Base ──────────────────────────────── */
.login-content {
  --background: #faf5ff;
  --color: #1e1033;
  font-family: 'Georgia', 'Times New Roman', serif;
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

/* ── Layout wrapper ────────────────────── */
.login-wrapper {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 24px;
  box-sizing: border-box;
}

/* ── Header ────────────────────────────── */
.login-header {
  text-align: center;
  margin-bottom: 28px;
}
.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px; height: 64px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(147,51,234,.2);
  margin-bottom: 20px;
}
.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #3b0764;
  letter-spacing: -0.5px;
  margin: 0 0 6px;
  font-family: 'Georgia', serif;
}
.login-subtitle {
  font-size: 15px;
  color: #7c3aed;
  margin: 0;
  font-family: -apple-system, sans-serif;
  font-weight: 400;
  opacity: .7;
}

/* ── Card ──────────────────────────────── */
.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 28px 24px 24px;
  box-shadow:
    0 4px 6px rgba(109,40,217,.05),
    0 20px 60px rgba(109,40,217,.12),
    inset 0 1px 0 rgba(255,255,255,0.9);
  border: 1px solid rgba(233,213,255,.6);
}

/* ── Tab switcher ──────────────────────── */
.tab-switcher {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #f3e8ff;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}
.tab-btn {
  position: relative;
  z-index: 2;
  background: none;
  border: none;
  padding: 9px 0;
  font-size: 14px;
  font-weight: 600;
  font-family: -apple-system, sans-serif;
  color: #9333ea;
  cursor: pointer;
  border-radius: 9px;
  transition: color .25s;
  letter-spacing: .2px;
}
.tab-btn.active { color: white; }
.tab-slider {
  position: absolute;
  top: 4px; left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: linear-gradient(135deg, #9333ea, #7e22ce);
  border-radius: 9px;
  transition: transform .3s cubic-bezier(.4,0,.2,1);
  box-shadow: 0 2px 8px rgba(147,51,234,.35);
}
.tab-slider.right { transform: translateX(100%); }

/* ── Fields ────────────────────────────── */
.field-group { margin-bottom: 16px; }
.field-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .8px;
  color: #7e22ce;
  margin-bottom: 8px;
  font-family: -apple-system, sans-serif;
}
.field-wrap {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1.5px solid #e9d5ff;
  border-radius: 12px;
  transition: border-color .2s, box-shadow .2s;
  overflow: hidden;
}
.field-wrap:focus-within {
  border-color: #9333ea;
  box-shadow: 0 0 0 3px rgba(147,51,234,.12);
}
.field-icon {
  position: absolute;
  left: 14px;
  color: #c084fc;
  pointer-events: none;
  flex-shrink: 0;
}
.custom-input {
  --background: transparent;
  --color: #1e1033;
  --placeholder-color: #c4b5fd;
  --placeholder-opacity: 1;
  --padding-start: 44px;
  --padding-end: 14px;
  --padding-top: 13px;
  --padding-bottom: 13px;
  font-size: 15px;
  font-family: -apple-system, sans-serif;
  width: 100%;
}

/* ── Buttons ───────────────────────────── */
.btn-primary {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  font-family: -apple-system, sans-serif;
  cursor: pointer;
  letter-spacing: .3px;
  box-shadow: 0 4px 16px rgba(147,51,234,.4);
  transition: transform .15s, box-shadow .15s, opacity .15s;
  margin-top: 4px;
}
.btn-primary:active { transform: scale(.98); box-shadow: 0 2px 8px rgba(147,51,234,.3); }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }

.btn-google {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 20px;
  background: white;
  color: #3b0764;
  border: 1.5px solid #e9d5ff;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: -apple-system, sans-serif;
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s, transform .15s;
}
.btn-google:active { transform: scale(.98); }
.btn-google:hover { border-color: #c084fc; box-shadow: 0 0 0 3px rgba(192,132,252,.12); }

/* ── Divider ───────────────────────────── */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
  font-size: 13px;
  color: #c4b5fd;
  font-family: -apple-system, sans-serif;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e9d5ff;
}

/* ── OTP section ───────────────────────── */
.otp-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1.5px dashed #e9d5ff;
}
.otp-hint {
  font-size: 13px;
  color: #7c3aed;
  text-align: center;
  margin: 0 0 14px;
  font-family: -apple-system, sans-serif;
  opacity: .8;
}
.otp-hint strong { color: #6b21a8; }
.otp-input { letter-spacing: 6px; font-weight: 700; font-size: 18px !important; }

/* ── Spinner ───────────────────────────── */
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Transitions ───────────────────────── */
.slide-up-enter-active { transition: all .3s cubic-bezier(.4,0,.2,1); }
.slide-up-enter-from  { opacity: 0; transform: translateY(12px); }

/* ── Tab content ───────────────────────── */
.tab-content { animation: fadeIn .2s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* ── Footer ────────────────────────────── */
.footer-note {
  margin-top: 20px;
  font-size: 12px;
  color: #a78bfa;
  text-align: center;
  font-family: -apple-system, sans-serif;
}
.footer-note a { color: #7e22ce; text-decoration: none; font-weight: 600; }
</style>