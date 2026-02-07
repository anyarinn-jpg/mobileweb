<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
        <ion-title class="toolbar-title">กระเป๋าเงิน</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="dark-content">
      <!-- สรุปยอด -->
      <div class="balance-card">
        <div class="balance-header">
          <div class="balance-main">
            <p class="balance-label">ยอดคงเหลือ</p>
            <h1 class="balance-amount">฿{{ (totalIncome - totalExpense).toLocaleString() }}</h1>
          </div>
        </div>
        
        <div class="summary-row">
          <div class="summary-item income-item">
            <div class="summary-icon income-bg">
              <ion-icon :icon="trendingUpOutline"></ion-icon>
            </div>
            <div>
              <p class="summary-label">รายรับ</p>
              <p class="summary-amount">฿{{ totalIncome.toLocaleString() }}</p>
            </div>
          </div>
          
          <div class="summary-item expense-item">
            <div class="summary-icon expense-bg">
              <ion-icon :icon="trendingDownOutline"></ion-icon>
            </div>
            <div>
              <p class="summary-label">รายจ่าย</p>
              <p class="summary-amount">฿{{ totalExpense.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- รายการธุรกรรม -->
      <div class="transaction-header">
        <h3>รายการล่าสุด</h3>
        <ion-badge class="count-badge">{{ expenses.length }}</ion-badge>
      </div>

      <div v-if="expenses.length > 0" class="transaction-list">
        <div
  v-for="item in expenses"
  :key="item.id"
  class="transaction-item"
  @click="goToEdit(item.id)"
>

          <div class="item-icon" :class="item.type === 'income' ? 'income-icon' : 'expense-icon'">
            <ion-icon :icon="item.type === 'income' ? trendingUpOutline : trendingDownOutline"></ion-icon>
          </div>
          
          <div class="item-content">
            <h4 class="item-title">{{ item.title }}</h4>
            <p class="item-detail">
              <ion-icon :icon="pricetagOutline" class="small-icon"></ion-icon>
              {{ item.category || 'ไม่ระบุ' }}
              <span v-if="item.note" class="note-separator">•</span>
              <span v-if="item.note">{{ item.note }}</span>
            </p>
            
          </div>

          <div class="item-amount" :class="item.type === 'income' ? 'income-text' : 'expense-text'">
            {{ item.type === 'income' ? '+' : '-' }}฿{{ item.amount.toLocaleString() }}
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <ion-icon :icon="receiptOutline" class="empty-icon"></ion-icon>
        <p class="empty-text">ยังไม่มีรายการ</p>
        <p class="empty-subtext">กดปุ่ม + เพื่อเพิ่มรายการแรก</p>
      </div>
  
      <!-- FAB Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button :router-link="'/tabs/add'" class="custom-fab">
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton
} from "@ionic/vue"

import { 
  trendingUpOutline, 
  trendingDownOutline,
  pricetagOutline,
  receiptOutline,
  addOutline
} from "ionicons/icons"

import { ref, onMounted } from "vue"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { useRouter } from "vue-router"


interface Expense {
  id: string
  title: string
  amount: number
  type: "income" | "expense"
  category: string
  note: string
}

const expenses = ref<Expense[]>([])
const totalIncome = ref(0)
const totalExpense = ref(0)
const router = useRouter()

const goToEdit = (id: string) => {
  router.push(`/tabs/edit/${id}`)
}

onMounted(() => {
  const q = query(
    collection(db, "expenses"),
    orderBy("createdAt", "desc")
  )

  onSnapshot(q, (snapshot) => {
    expenses.value = []
    totalIncome.value = 0
    totalExpense.value = 0

    snapshot.forEach((doc) => {
      const data = doc.data() as Omit<Expense, "id">
      const item = { id: doc.id, ...data }

      expenses.value.push(item)

      if (item.type === "income") {
        totalIncome.value += item.amount
      } else {
        totalExpense.value += item.amount
      }
    })
  })
})
</script>

<style scoped>
/* Dark Background */
.dark-content {
  --background: #1a1d2e;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 16px;
  --padding-end: 16px;
}

/* Custom Toolbar */
.custom-toolbar {
  --background: #1a1d2e;
  --color: #ffffff;
  --border-width: 0;
}

.toolbar-title {
  color: #ffffff;
  font-weight: 600;
  font-size: 20px;
}

/* Balance Card */
.balance-card {
  background: linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%);
  border-radius: 24px;
  padding: 24px;
  margin: 16px 0 24px 0;
  box-shadow: 0 8px 24px rgba(167, 139, 250, 0.3);
}

.balance-header {
  margin-bottom: 20px;
}

.balance-main {
  text-align: center;
}

.balance-label {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: rgba(26, 29, 46, 0.7);
  font-weight: 600;
}

.balance-amount {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  color: #1a1d2e;
  letter-spacing: -1px;
}

/* Summary Row */
.summary-row {
  display: flex;
  gap: 12px;
}

.summary-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(26, 29, 46, 0.2);
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.income-bg {
  background: rgba(45, 211, 111, 0.2);
  color: #2dd36f;
}

.expense-bg {
  background: rgba(235, 68, 90, 0.2);
  color: #eb445a;
}

.summary-label {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: rgba(26, 29, 46, 0.6);
  font-weight: 500;
}

.summary-amount {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1d2e;
}

/* Transaction Header */
.transaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px 16px 4px;
}

.transaction-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
}

.count-badge {
  --background: #2a2d42;
  --color: #a78bfa;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 12px;
}

/* Transaction List */
.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 80px;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #2a2d42;
  border-radius: 16px;
  padding: 16px;
  transition: all 0.2s ease;
}

.transaction-item:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.item-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.income-icon {
  background: rgba(45, 211, 111, 0.15);
  color: #2dd36f;
}

.expense-icon {
  background: rgba(235, 68, 90, 0.15);
  color: #eb445a;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.item-detail {
  font-size: 13px;
  color: #8b92b0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.small-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.note-separator {
  margin: 0 4px;
}

.item-amount {
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.income-text {
  color: #2dd36f;
}

.expense-text {
  color: #eb445a;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 80px;
  color: #3d4255;
  margin-bottom: 16px;
}

.empty-text {
  color: #8b92b0;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.empty-subtext {
  color: #5a5f7a;
  font-size: 14px;
  margin: 0;
}

/* FAB Button */
.custom-fab {
  --background: linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%);
  --background-activated: linear-gradient(135deg, #9370f0 0%, #b39cf0 100%);
  --color: #1a1d2e;
  --box-shadow: 0 8px 24px rgba(167, 139, 250, 0.4);
}

.custom-fab ion-icon {
  font-size: 28px;
}
</style>