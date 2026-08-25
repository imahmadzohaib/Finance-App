<template>
  <div class="grid grid-cols-2 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 font-bold">
    <div class="flex items-center justify-between">
      {{ date }}
    </div>


    <div class="flex items-center justify-end space-x-2 mr-10">
     {{ currency }}
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  transactions: Array,
  date:String,
})


const sum = computed(()=>{
  let sum = 0;

  for(const transaction of props.transactions){
    if(transaction.type === 'Income'){
      sum+= transaction.amount;
    }else{
      sum -= transaction.amount;
    }
  }

  return sum;
})


const { currency } =  useCurrency(sum);

</script>
