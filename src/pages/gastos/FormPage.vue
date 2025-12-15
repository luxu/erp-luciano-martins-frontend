<template>
  <q-page padding>
    <div class="q-pa-md" style="max-width: 900px; margin: auto;">
      <h5 class="text-h5 q-mb-lg">
        Form Gasto
      </h5>
      <!--  form -->
      <q-form @submit.prevent="handlerSubmit" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <!--  name -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              label="Nome do gasto"
              filled
              v-model="form.name"
              :rules="requiredRules"
            />
          </div>
          <!--  datagasto -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              label="Data do gasto"
              filled
              mask="##/##/####"
              v-model="form.datagasto"
              :rules="requiredRules"
            >
            <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.datagasto" mask="DD/MM/YYYY" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <!--  segmento -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              label="Segmento"
              filled
              v-model="form.segmento_id"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="options_segmento"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!--  card_bank -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              label="Cartão de Banco"
              filled
              v-model="form.card_bank_id"
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="options_card_bank"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-col-gutter-md">
          <!--  opcoes_cartao -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              label="Opções do Cartão"
              filled
              :options="options_opcoes_cartao"
              v-model="form.opcoes_cartao"
              option-label="label"
              option-value="value"
            />
          </div>
          <!--  description_on_invoice -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              label="Descrição na fatura"
              filled
              v-model="form.description_on_invoice"
            />
          </div>
          <!--  more_infos -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              label="Mais informações"
              filled
              v-model="form.more_infos"
            />
          </div>
          <!--  total -->
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              label="Total"
              filled
              v-model="form.total"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-btn
              label="Cadastrar" 
              type="submit" 
              color="primary" 
              class="q-mt-md"
            />
            <q-btn 
              label="Limpar" 
              type="reset" 
              color="primary" 
              flat class="q-ml-sm q-mt-md"
            />
          </div>
        </div>
        </q-form>
    </div>
  </q-page>
</template>

<script>

import {
  computed, defineComponent, onMounted, ref,
} from 'vue';
import { api } from 'boot/axios';
import { useRoute, useRouter } from 'vue-router';
import useNotify from 'src/composables/UseNotify';

export default defineComponent({
  name: 'FormPageGasto',
  setup() {
    const form = ref({
      name: '',
      datagasto: '',
      segmento_id: '',
      card_bank_id: '',
      opcoes_cartao: '',
      total: '',
      description_on_invoice: '',
      more_infos: '',
    });
    const options_opcoes_cartao = [
      { label: 'Crédito', value: 'C' },
      { label: 'Débito', value: 'D' },
      { label: 'Transferência', value: 'T' }
    ];
    const options_card_bank = ref([]);
    const options_segmento = ref([]);
    const router = useRouter();
    const route = useRoute();
    const { notifyError, notifySuccess } = useNotify();
    const requiredRules = [
      (val) => (val && val.length > 0) || 'Este campo é obrigatório',
    ];
    const isUpdate = computed(() => route.params.id);

    const handleGetGasto = async (id) => {
      try {
        const gasto = await api.get(`gastos/${id}`);
        form.value = gasto.data;
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetCardBanks = async () => {
      await api.get('cardbanks')
        .then((response) => {
          options_card_bank.value = response.data.items.map( cardbank => ({
            label: cardbank.name,
            value: cardbank.id,
          }));
        })
        .catch((error) => {
          notifyError(error.message);
        });
    }

    const handleGetSegmentos = async () => {
      await api.get('segmentos')
        .then((response) => {
          options_segmento.value = response.data.map( segmento => ({
            label: segmento.name,
            value: segmento.id,
          }));
        })
        .catch((error) => {
          notifyError(error.message);
        });
    }

    const handlerSubmit = async () => {
      const formData = form.value;
      try {
        if (isUpdate.value) {
          const originalDate = formData.datagasto; // "15/12/2025"
          const convertedDate = originalDate.split('/').reverse().join('-');
          const dataToSend = {
              name: formData.name,
              datagasto: convertedDate, // "2025-12-15"
              segmento_id: formData.segmento.id,
              card_bank_id: formData.card_bank.id,
              opcoes_cartao: formData.opcoes_cartao,
              more_infos: formData.more_infos,
              description_on_invoice: formData.description_on_invoice,
              total: formData.total,
          };
          await api.patch(`gastos/${isUpdate.value}`, dataToSend);
          notifySuccess('Update Successfully');
        } else {
          const originalDate = formData.datagasto; // "15/12/2025"
          const convertedDate = originalDate.split('/').reverse().join('-');
          const dataToSend = {
              name: formData.name,
              datagasto: convertedDate, // "2025-12-15"
              segmento_id: formData.segmento_id.value,
              card_bank_id: formData.card_bank_id.value,
              opcoes_cartao: formData.opcoes_cartao.value,
              more_infos: formData.more_infos,
              description_on_invoice: formData.description_on_invoice,
              total: formData.total,
          };
          await api.post('gastos', dataToSend);
          notifySuccess('Saved Successfully');
        }
        router.push({ name: 'gastos' });
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      handleGetCardBanks();      
      handleGetSegmentos();
      if (isUpdate.value) {
        handleGetGasto(isUpdate.value);
      }
    });

    return {
      form,
      options_opcoes_cartao,
      options_card_bank,
      options_segmento,
      requiredRules,
      handlerSubmit,
      isUpdate,
    };
  },
});

</script>
