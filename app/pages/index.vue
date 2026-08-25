<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">
      Summary
    </h1>
    <div>
      <USelectMenu :items="transactionViewOptions" v-model="selectedView"  :search-input="false"/>
    </div>
  </section>

  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="prevIncomeTotal" :loading="pending" />
    <Trend color="red" title="Expense" :amount="expenseTotal" :last-amount="prevExpenseTotal" :loading="pending" />
    <Trend color="green" title="Investments" :amount="investmentTotal" :last-amount="prevInvestmentTotal" :loading="pending" />
    <Trend color="red" title="Saving" :amount="savingTotal" :last-amount="prevSavingTotal" :loading="pending" />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
      </div>
    </div>
    <div>
      <UButton icon="i-heroicons-plus-circle" color="neutral" variant="outline" label="Add"  @click="isOpen = true" />
      <TransactionalModal v-model="isOpen" @saved="refreshAll" />
    </div>
  </section>

  <section v-if="!pending">
    <div v-for="(transactionsOnDay, date) in byDate" :key="date" class="mb-10">
      <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
      <Transaction v-for="transaction in transactionsOnDay" :key="transaction.id" :transaction="transaction"
        @deleted="refreshAll" @edited="refreshAll" />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants'

const user = useSupabaseUser();

const selectedView = ref(user.value.user_metadata?.transaction_view ?? transactionViewOptions[1]) 
const isOpen = ref(false)
const {current,previous} = useSelectedTimePeriod(selectedView);

const { pending, refresh, transactions: {
    incomeCount,
    incomeTotal,
    expenseCount,
    expenseTotal,
    investmentTotal,
    savingTotal,
    grouped: {
      byDate
    }
  }
} = useFetchTransactions(current)

const { refresh: refreshPrevious,
   transactions: {
    incomeTotal:prevIncomeTotal,
    expenseTotal:prevExpenseTotal,
    investmentTotal: prevInvestmentTotal,
    savingTotal: prevSavingTotal,
  } } = useFetchTransactions(previous)


const refreshAll = async () => {
  await Promise.all([refresh(), refreshPrevious()])
}

await refreshAll()
</script>