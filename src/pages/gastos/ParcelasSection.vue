<template>
  <q-card class="q-mt-lg dark-card">
    <q-card-section class="bg-primary text-white text-subtitle1">
      Parcelas
    </q-card-section>

    <q-card-section>
      <q-btn
        label="Adicionar Parcela"
        class="full-width q-mb-md"
        color="grey-7"
        @click="addParcela"
      />

      <div v-for="(parcela, index) in model" :key="index" class="q-mb-md">
        <div class="row q-col-gutter-sm items-center">
          
          <div class="col-3">
            <q-input
              filled
              :model-value="parcela.total_parcelas"
              @update:model-value="updateTotalParcelas($event, index)"
              label="Total de parcelas"
              type="number"
            />
          </div>
          
          <div class="col-2">
            <q-input
              filled
              :model-value="parcela.parcela_nro"
              label="Parcela nro"
              type="number"
              readonly
            />
          </div>

          <div class="col-3">
            <q-input
              filled
              :model-value="parcela.valor"
              @update:model-value="updateParcelaField(index, 'valor', $event)"
              label="Valor da Parcela"
              type="number"
              prefix="R$"
            />
          </div>

          <div class="col-3">
            <q-input
              filled
              :model-value="parcela.data_parcela"
              @update:model-value="updateParcelaField(index, 'data_parcela', $event)"
              label="Data da Parcela"
              mask="##/##/####"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date :model-value="parcela.data_parcela" @update:model-value="updateParcelaField(index, 'data_parcela', $event)" mask="DD/MM/YYYY" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <div class="col-1 text-center">
            <q-btn
              flat
              round
              icon="delete"
              color="negative"
              @click="removeParcela(index)"
            />
          </div>
        </div>
      </div>
      
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';

// Define as props que o componente espera receber do pai.
// 'modelValue' é o nome padrão para usar v-model no componente.
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

// Define os eventos que o componente pode emitir.
const emit = defineEmits(['update:modelValue']);

// Usa 'computed' para gerenciar o array de parcelas. 
// O get retorna as props, e o set emite o evento de atualização para o pai.
const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// 📌 FUNÇÃO UTILITÁRIA PARA CÁLCULO DE DATA
const addDaysToDate = (dateStr, days) => {
    // 🚨 VERIFICAÇÃO: Se a string da data for vazia ou inválida, retorna string vazia.
    if (!dateStr || dateStr.indexOf('/') === -1) return '';
    
    // 1. Converte DD/MM/YYYY para Objeto Date
    const parts = dateStr.split('/');
    // new Date(ano, mesIndex, dia). Mês é 0-indexado.
    const date = new Date(parts[2], parts[1] - 1, parts[0]); 

    // 2. Adiciona os dias
    date.setDate(date.getDate() + days);

    // 3. Converte de volta para DD/MM/YYYY
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 para voltar ao formato 1-12
    const y = date.getFullYear();

    return `${d}/${m}/${y}`;
};

// 1. Adiciona uma nova linha de parcela
const addParcela = () => {
    const currentParcelas = [...model.value];
    const nextNro = currentParcelas.length + 1;
    const totalParcelas = currentParcelas.length > 0 ? currentParcelas[0].total_parcelas : 1;

    const daysToAdd = nextNro * 30;

  // 🚨 VERIFICAÇÃO: Calcula a data SOMENTE se dataGasto estiver preenchida.
    const calculatedDate = props.dataGasto 
        ? addDaysToDate(props.dataGasto, daysToAdd)
        : ''; // Se vazio, a data da parcela fica vazia.

    const newParcela = {
        total_parcelas: nextNro, // Assume-se que, ao adicionar uma, o total aumenta
        parcela_nro: nextNro,
        valor: 0.00,
        data_parcela: props.dataGasto || '' // Usa a data principal como sugestão
    };

    currentParcelas.push(newParcela);
    updateAllTotalParcelas(nextNro, currentParcelas); // Atualiza o total de todas
    model.value = currentParcelas;
};

// 2. Remove uma linha de parcela
const removeParcela = (index) => {
  const currentParcelas = [...model.value];
  currentParcelas.splice(index, 1);
  
  // Reorganiza os números e o total das parcelas restantes
  currentParcelas.forEach((p, i) => {
    p.parcela_nro = i + 1;
  });
  
  const newTotal = currentParcelas.length;
  updateAllTotalParcelas(newTotal, currentParcelas);

  model.value = currentParcelas;
};

// 3. Atualiza um campo específico de uma parcela (Valor ou Data)
const updateParcelaField = (index, field, value) => {
  const currentParcelas = [...model.value];
  currentParcelas[index][field] = value;
  model.value = currentParcelas;
};

// 4. Atualiza o Total de Parcelas e sincroniza todas as linhas
const updateTotalParcelas = (newTotalString, index) => {
    // Garante que é um número inteiro
    const newTotal = parseInt(newTotalString) || 0;
    
    // O ideal é que o 'Total de parcelas' seja o mesmo em todas as linhas
    const currentParcelas = [...model.value];
    updateAllTotalParcelas(newTotal, currentParcelas);

    model.value = currentParcelas;
};

const updateAllTotalParcelas = (newTotal, parcelasArray) => {
    parcelasArray.forEach(p => {
        p.total_parcelas = newTotal;
    });
}
</script>