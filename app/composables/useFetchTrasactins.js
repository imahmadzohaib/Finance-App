export const useFetchTransactions = (period) => {
  const supabase = useSupabaseClient()

  const transactions = ref([])
  const pending = ref(false)

  const income = computed(() =>
    transactions.value.filter(t => t.type === 'Income')
  )

  const expense = computed(() =>
    transactions.value.filter(t => t.type === 'Expense')
  )

  const incomeCount = computed(() => income.value.length)
  const expenseCount = computed(() => expense.value.length)

  const incomeTotal = computed(() =>
    income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  )

  const expenseTotal = computed(() =>
    expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  )



    const investment = computed(() =>
    transactions.value.filter(t => t.type === 'Income')
  )

  const saving = computed(() =>
    transactions.value.filter(t => t.type === 'Expense')
  )



  const investmentTotal = computed(() =>
    investment.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  )

  const savingTotal = computed(() =>
    saving.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  )


  const fetchTransactions = async () => { 
    pending.value = true

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select()
        .gte('created_at',period.value.from.toISOString())
        .lte('created_at',period.value.to.toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching transactions:', error)
        return []
      }

      return data ?? []
    } finally {
      pending.value = false
    }
  }

 const refresh = async () => {
  const data = await fetchTransactions()
  transactions.value = data

  return data
}

  watch(period, refresh)


  const transactionsGroupedByDate = computed(() => {
    const grouped = {}

    for (const transaction of transactions.value) {
      const date = transaction.created_at.split('T')[0]

      if (!grouped[date]) {
        grouped[date] = []
      }

      grouped[date].push(transaction)
    }

    return grouped
  })

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate
      },
      income,
      expense,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount,
      investmentTotal,
      savingTotal
    },
    refresh,
    pending
  }
}