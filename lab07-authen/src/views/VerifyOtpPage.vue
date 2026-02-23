<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1>Verify OTP</h1>

      <ion-input
        v-model="otp"
        placeholder="Enter OTP"
        type="number"
      />

      <ion-button expand="block" @click="confirmOtp">
        Confirm OTP
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IonPage, IonContent, IonInput, IonButton } from "@ionic/vue";
import { authService } from "@/auth/auth-service";

const route = useRoute();
const router = useRouter();

const otp = ref("");

const verificationId = route.query.vid as string;

const confirmOtp = async () => {
  try {
    await authService.confirmPhoneCode({
  verificationId,
  verificationCode: otp.value,
});
   

    router.replace("/tabs/tab1");

  } catch (err) {
    console.error(err);
  }
};
</script>