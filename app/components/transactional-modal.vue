<template>
  <UModal
    v-model:open="isOpen"
    :title="`${isEditing ? 'Edit' : 'Add'} Transaction`"
  >
    <template #body>
      <UForm :state="state" :schema="schema" ref="form" @submit="save">
        <UFormField label="Transaction Type" name="type" required class="mb-4">
          <USelect
            v-model="state.type"
            :items="types"
            :disabled="isEditing"
            placeholder="Select the transaction type"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Amount" name="amount" required class="mb-4">
          <UInput
            v-model.number="state.amount"
            type="number"
            placeholder="Amount"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Transaction date"
          name="created_at"
          required
          class="mb-4"
        >
          <UInput
            v-model="state.created_at"
            type="date"
            icon="i-lucide-calendar"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Description"
          hint="Optional"
          name="description"
          class="mb-4"
        >
          <UInput
            v-model="state.description"
            placeholder="Description"
            class="w-full"
          />
        </UFormField>

        <UFormField
          v-if="state.type === 'Expense'"
          label="Category"
          name="category"
          required
          class="mb-4"
        >
          <USelect
            v-model="state.category"
            :items="categories"
            placeholder="Category"
            class="w-full"
          />
        </UFormField>

        <div class="mt-6 flex justify-end gap-2">
          <UButton
            type="submit"
            color="neutral"
            variant="solid"
            label="Save"
            :loading="isLoading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
import { categories, types } from "~/constants";
import { z } from "zod";

const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false,
  },
});
const isEditing = computed(() => !!props.transaction);

const emit = defineEmits(['update:modelValue', 'saved']);

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amount needs to be more than 0"),
});

const incomeSchema = z.object({
  type: z.literal("Income"),
});
const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories),
});
const investmentSchema = z.object({
  type: z.literal("Investment"),
});
const savingSchema = z.object({
  type: z.literal("Saving"),
});

const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema,
);

const form = ref();
const isLoading = ref(false);
const supabase = useSupabaseClient();
const { toastError, toastSuccess } = useAppToast();

const save = async () => {
  if (form.value.errors.length) return;

  isLoading.value = true;
  try {
    const { error } = await supabase.from("transactions").upsert({
      ...state.value,
      id: props.transaction?.id,
    });

    if (!error) {
      toastSuccess({
        title: "Transaction saved",
      });
      isOpen.value = false;
      emit('saved');
    }else{
        throw error;
    }


  } catch (e) {
    toastError({
      title: "Transaction not saved",
      description: e.message,
    });
  } finally {
    isLoading.value = false;
  }
};

const initialState = isEditing.value
  ? {
      type: props.transaction.type,
      amount: props.transaction.amount,
      created_at: props.transaction.created_at.split("T")[0],
      description: props.transaction.description,
      category: props.transaction.category,
    }
  : {
      type: undefined,
      amount: 0,
      created_at: undefined,
      description: undefined,
      category: undefined,
    };
const state = ref({ ...initialState });

const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value?.clear();
};

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit('update:modelValue', value);
  },
});
</script>
