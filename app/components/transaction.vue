<template>
  <div
    class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
  >
    <div class="flex items-center justify-between col-span-2 space-x-4">
      <div class="flex items-center space-x-1">
        <UIcon :name="icon" :class="iconColor" />
        <div>{{ transaction.description }}</div>
      </div>
      <div>
        <UBadge color="neutral" variant="outline" v-if="transaction.category">{{
          transaction.category
        }}</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end space-x-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdownMenu :items="items" :popper="{ placement: 'bottom-start' }">
          <UButton
            color="neutral"
            variant="ghost"
            trailing-icon="i-heroicons-ellipsis-horizontal"
            :loading="isLoading"
          />

          <TransactionalModal v-model="isOpen" :transaction="transaction" @saved="emit('edited')"/>
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transaction: Object,
});
const emit = defineEmits(['deleted', 'edited']);

const { currency } = useCurrency(computed(() => props.transaction.amount));
const isIncome = computed(() => props.transaction.type === "Income");
const iconColor = computed(() =>
  isIncome.value ? "text-green-600" : "text-red-600",
);
const icon = computed(() =>
  isIncome.value ? "i-heroicons-arrow-up-right" : "i-heroicons-arrow-down-left",
);
const supabase = useSupabaseClient();

const isLoading = ref(false);
const { toastError, toastSuccess } = useAppToast();

const isOpen = ref(false);

const deleteTransaction = async () => {
  isLoading.value = true;
  try {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", props.transaction.id);

    if (error) throw error;

    toastSuccess({
      title: "Transaction deleted",
    });

    emit('deleted', props.transaction.id);
  } catch (error) {
    toastError({
      title: "Transaction not deleted",
    });
  } finally {
    isLoading.value = false;
  }
};

const items = [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      onSelect: () => (isOpen.value = true),
    },

    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      onSelect: deleteTransaction,
    },
  ],
];
</script>
