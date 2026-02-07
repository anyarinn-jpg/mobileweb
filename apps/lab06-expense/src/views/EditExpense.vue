<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
        <ion-buttons slot="start">
          <ion-button @click="router.push('/tabs/tab1')">
            <span class="cancel-text">ยกเลิก</span>
          </ion-button>
        </ion-buttons>
        <ion-title class="toolbar-title">แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="dark-content">
      <!-- Type Toggle -->
      <div class="type-toggle">
        <button 
          class="toggle-btn" 
          :class="{ active: type === 'expense' }"
          @click="type = 'expense'">
          รายจ่าย
        </button>
        <button 
          class="toggle-btn" 
          :class="{ active: type === 'income' }"
          @click="type = 'income'">
          รายรับ
        </button>
      </div>

      <!-- Amount Section -->
      <div class="amount-section">
        <p class="amount-label">ระบุจำนวนเงิน</p>
        <div class="amount-display">
          <span class="currency-symbol">฿</span>
          <input 
            type="number" 
            v-model="amount" 
            placeholder="0.00"
            class="amount-value"
          />
        </div>
      </div>

      <!-- Form Fields -->
      <div class="form-fields">
        <!-- Title (Name) -->
        <div class="field-item">
          <div class="field-icon title-icon">
            <ion-icon :icon="documentTextOutline"></ion-icon>
          </div>
          <div class="field-content full-width">
            <p class="field-label">ชื่อรายการ</p>
            <input 
              type="text"
              v-model="title"
              placeholder="เช่น ค่าอาหาร, เงินเดือน..."
              class="field-input"
            />
          </div>
        </div>

        <!-- Category -->
        <div class="field-item">
          <div class="field-icon category-icon">
            <ion-icon :icon="pricetagOutline"></ion-icon>
          </div>
          <div class="field-content full-width">
            <p class="field-label">หมวดหมู่</p>
            <input 
              type="text"
              v-model="category"
              placeholder="เช่น อาหาร, เดินทาง, ช้อปปิ้ง..."
              class="field-input"
            />
          </div>
        </div>

        <!-- Note -->
        <div class="field-item">
          <div class="field-icon note-icon">
            <ion-icon :icon="readerOutline"></ion-icon>
          </div>
          <div class="field-content full-width">
            <p class="field-label">หมายเหตุ</p>
            <textarea 
              v-model="note"
              placeholder="เพิ่มรายละเอียด (ถ้ามี)..."
              class="field-textarea"
              rows="2"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-section">
        <ion-button 
          expand="block" 
          class="save-btn"
          @click="updateExpense">
          <ion-icon slot="start" :icon="checkmarkCircleOutline"></ion-icon>
          บันทึกการแก้ไข
        </ion-button>

        <ion-button 
          expand="block" 
          fill="outline"
          class="delete-btn"
          @click="confirmDelete">
          <ion-icon slot="start" :icon="trashOutline"></ion-icon>
          ลบรายการ
        </ion-button>
      </div>
    </ion-content>

    <!-- Delete Confirmation Alert -->
    <ion-alert
      :is-open="showDeleteAlert"
      header="ยืนยันการลบ"
      message="คุณต้องการลบรายการนี้ใช่หรือไม่?"
      :buttons="alertButtons"
      @didDismiss="showDeleteAlert = false"
    ></ion-alert>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonAlert,
  toastController,
  alertController
} from "@ionic/vue"

import {
  documentTextOutline,
  pricetagOutline,
  readerOutline,
  checkmarkCircleOutline,
  trashOutline
} from "ionicons/icons"

import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase"

const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const title = ref("")
const amount = ref<number | null>(null)
const type = ref<"income" | "expense">("expense")
const category = ref("")
const note = ref("")
const showDeleteAlert = ref(false)

const alertButtons = [
  {
    text: 'ยกเลิก',
    role: 'cancel'
  },
  {
    text: 'ลบ',
    role: 'confirm',
    handler: () => {
      deleteExpense()
    }
  }
]

// 🔹 โหลดข้อมูลเดิม
onMounted(async () => {
  try {
    const snap = await getDoc(doc(db, "expenses", id))
    if (snap.exists()) {
      const data = snap.data()
      title.value = data.title
      amount.value = data.amount
      type.value = data.type
      category.value = data.category
      note.value = data.note
    } else {
      const toast = await toastController.create({
        message: "ไม่พบรายการนี้",
        duration: 2000,
        color: "danger",
        position: "top"
      })
      await toast.present()
      router.push("/tabs/tab1")
    }
  } catch (error) {
    const toast = await toastController.create({
      message: "เกิดข้อผิดพลาดในการโหลดข้อมูล",
      duration: 2000,
      color: "danger",
      position: "top"
    })
    await toast.present()
  }
})

// 🔹 อัปเดตข้อมูล
const updateExpense = async () => {
  if (!title.value || !amount.value) {
    const toast = await toastController.create({
      message: "กรุณากรอกชื่อรายการและจำนวนเงิน",
      duration: 2000,
      color: "warning",
      position: "top"
    })
    await toast.present()
    return
  }

  try {
    await updateDoc(doc(db, "expenses", id), {
      title: title.value,
      amount: Number(amount.value),
      type: type.value,
      category: category.value || "ไม่ระบุ",
      note: note.value,
      updatedAt: new Date()
    })

    const toast = await toastController.create({
      message: "✅ อัปเดตรายการสำเร็จ",
      duration: 1500,
      color: "success",
      position: "top"
    })
    await toast.present()

    router.push("/tabs/tab1")
  } catch (error) {
    const toast = await toastController.create({
      message: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      duration: 2000,
      color: "danger",
      position: "top"
    })
    await toast.present()
  }
}

// 🔹 ยืนยันการลบ
const confirmDelete = () => {
  showDeleteAlert.value = true
}

// 🔹 ลบรายการ
const deleteExpense = async () => {
  try {
    await deleteDoc(doc(db, "expenses", id))

    const toast = await toastController.create({
      message: "🗑️ ลบรายการสำเร็จ",
      duration: 1500,
      color: "success",
      position: "top"
    })
    await toast.present()

    router.push("/tabs/tab1")
  } catch (error) {
    const toast = await toastController.create({
      message: "เกิดข้อผิดพลาดในการลบ",
      duration: 2000,
      color: "danger",
      position: "top"
    })
    await toast.present()
  }
}
</script>

<style scoped>
/* Dark Background */
.dark-content {
  --background: #1a1d2e;
}

/* Custom Toolbar */
.custom-toolbar {
  --background: #1a1d2e;
  --color: #ffffff;
  --border-width: 0;
}

.cancel-text {
  color: #a78bfa;
  font-size: 16px;
}

.toolbar-title {
  color: #ffffff;
  font-weight: 600;
}

/* Type Toggle */
.type-toggle {
  display: flex;
  gap: 12px;
  padding: 20px 16px 0;
}

.toggle-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #2a2d42;
  color: #8b92b0;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%);
  color: #1a1d2e;
}

/* Amount Section */
.amount-section {
  padding: 32px 16px;
  text-align: center;
}

.amount-label {
  color: #8b92b0;
  font-size: 14px;
  margin: 0 0 16px 0;
}

.amount-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.currency-symbol {
  font-size: 48px;
  font-weight: 600;
  color: #a78bfa;
}

.amount-value {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 64px;
  font-weight: 600;
  width: 220px;
  text-align: left;
}

.amount-value::placeholder {
  color: #3d4255;
}

.amount-value::-webkit-outer-spin-button,
.amount-value::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Form Fields */
.form-fields {
  padding: 0 16px;
}

.field-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #2a2d42;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.field-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.title-icon {
  background: rgba(167, 139, 250, 0.15);
  color: #a78bfa;
}

.category-icon {
  background: rgba(251, 146, 60, 0.15);
  color: #fb923c;
}

.note-icon {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
}

.field-content {
  flex: 1;
}

.field-content.full-width {
  flex: 1;
}

.field-label {
  color: #8b92b0;
  font-size: 13px;
  margin: 0 0 8px 0;
}

.field-input,
.field-textarea {
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  font-family: inherit;
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: #5a5f7a;
}

.field-textarea {
  resize: none;
  line-height: 1.5;
}

/* Action Section */
.action-section {
  padding: 24px 16px;
  margin-top: auto;
}

.save-btn {
  --background: linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%);
  --background-activated: linear-gradient(135deg, #9370f0 0%, #b39cf0 100%);
  --border-radius: 16px;
  --color: #1a1d2e;
  height: 56px;
  font-size: 18px;
  font-weight: 700;
  text-transform: none;
  margin: 0 0 12px 0;
}

.delete-btn {
  --border-radius: 16px;
  --border-color: #eb445a;
  --color: #eb445a;
  height: 56px;
  font-size: 18px;
  font-weight: 700;
  text-transform: none;
  margin: 0;
}

/* Alert Styling */
ion-alert {
  --background: #2a2d42;
  --color: #ffffff;
}
</style>