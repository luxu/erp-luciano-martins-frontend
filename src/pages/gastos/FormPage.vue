<template>
  <q-page padding>
    <div class="q-pa-md" style="max-width: 900px; margin: auto;">
      <h5 class="text-h5 q-mb-lg">Form Gasto</h5>

      <q-form ref="formRef" class="q-gutter-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              label="Nome do gasto"
              filled
              v-model="form.name"
              :rules="requiredRules"
            />
          </div>

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

          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              label="Segmento"
              filled
              v-model="form.segmento_id"
              :options="options_segmento"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              :rules="requiredRules"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              label="Cartão de Banco"
              filled
              v-model="form.card_bank_id"
              :options="options_card_bank"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              :rules="requiredRules"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-select
              label="Opções do Cartão"
              filled
              v-model="form.opcoes_cartao"
              :options="options_opcoes_cartao"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              :rules="requiredRules"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              label="Descrição na fatura"
              filled
              v-model="form.description_on_invoice"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              label="Mais informações"
              filled
              v-model="form.more_infos"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-input
              label="Total"
              filled
              v-model="form.total"
              :rules="requiredRules"
            />
          </div>
        </div>
      </q-form>

      <div class="q-pa-md q-gutter-md dark-bg">
        <ParcelasSection v-model="parcelas" />

        <q-card-actions align="left">
          <q-btn flat label="Back" icon="arrow_back" color="white" class="bg-grey-7" />
          <q-btn label="Salvar" icon="check" color="positive" @click="handlerSubmit" />
        </q-card-actions>
      </div>
    </div>
  </q-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useRoute, useRouter } from 'vue-router';
import useNotify from 'src/composables/UseNotify';
import ParcelasSection from './ParcelasSection.vue';

export default defineComponent({
  name: 'FormPageGasto',
  components: {
    ParcelasSection
  },

  setup() {
    const formRef = ref(null);

    const form = ref({
      name: '',
      datagasto: '',
      segmento_id: null,
      card_bank_id: null,
      opcoes_cartao: null,
      total: 0,
      description_on_invoice: '',
      more_infos: '',
    });

    const parcelas = ref([
      {
        parcelas: 1,
        numero_parcela: 1,
        valor_parcela: 0,
        data_parcela: ''
      }
    ]);

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
    const isUpdate = computed(() => route.params.id);

    const requiredRules = [
      (val) => (val !== null && val !== undefined && val !== '') || 'Este campo é obrigatório',
    ];

    const convertDateToApi = (dateBr) => {
      if (!dateBr || dateBr.indexOf('/') === -1) return null;
      return dateBr.split('/').reverse().join('-');
    };

    const calculateFirstParcelDate = (dateStr) => {
      if (!dateStr || dateStr.indexOf('/') === -1) return '';
      const parts = dateStr.split('/');
      const date = new Date(parts[2], parts[1] - 1, parts[0]);
      date.setDate(date.getDate() + 30);
      const d = String(date.getDate()).padStart(2, '0');
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const y = date.getFullYear();
      return `${d}/${m}/${y}`;
    };

    const validateParcelas = () => {
      if (!parcelas.value.length) {
        notifyError('Adicione pelo menos uma parcela');
        return false;
      }

      for (const parcela of parcelas.value) {
        if (!parcela.parcelas || !parcela.numero_parcela || parcela.valor_parcela === '' || !parcela.data_parcela) {
          notifyError('Preencha corretamente todas as parcelas');
          return false;
        }
      }

      return true;
    };

    const handleGetGasto = async (id) => {
      try {
        const { data } = await api.get(`gastos/${id}`);

        form.value = {
              name: data.name ?? '',
              datagasto: data.datagasto ? data.datagasto.split('-').reverse().join('/') : '',
              segmento_id: data.segmento_id ?? data.segmento?.id ?? null,
              card_bank_id: data.card_bank_id ?? data.card_bank?.id ?? null,
              opcoes_cartao: data.opcoes_cartao ?? null,
              total: data.total ?? 0,
              description_on_invoice: data.description_on_invoice ?? '',
              more_infos: data.more_infos ?? '',
            };        
        
        if (data.parcelas?.length) {
          parcelas.value = data.parcelas.map((p) => ({
            id: p.id,
            parcelas: p.parcelas,
            numero_parcela: p.numero_parcela,
            valor_parcela: p.valor_parcela,
            data_parcela: p.data_parcela ? p.data_parcela.split('-').reverse().join('/') : '',
          }));
        } else {
          parcelas.value = [
            {
              parcelas: 1,
              numero_parcela: 1,
              valor_parcela: data.total ?? 0,
              data_parcela: calculateFirstParcelDate(
                data.datagasto ? data.datagasto.split('-').reverse().join('/') : ''
              )
            }
          ];
          console.log('parcelas', parcelas.value);
        }
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetCardBanks = async () => {
      try {
        const response = await api.get('cardbanks');
        options_card_bank.value = response.data.items.map((cardbank) => ({
          label: cardbank.name,
          value: cardbank.id,
        }));
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetSegmentos = async () => {
      try {
        const response = await api.get('segmentos');
        options_segmento.value = response.data.map((segmento) => ({
          label: segmento.name,
          value: segmento.id,
        }));
      } catch (error) {
        notifyError(error.message);
      }
    };

    const buildGastoPayload = () => ({
      name: form.value.name,
      datagasto: convertDateToApi(form.value.datagasto),
      segmento_id: form.value.segmento_id,
      card_bank_id: form.value.card_bank_id,
      opcoes_cartao: form.value.opcoes_cartao,
      more_infos: form.value.more_infos,
      description_on_invoice: form.value.description_on_invoice,
      total: form.value.total,
    });

    const buildParcelasPayload = (gastoId) =>
      parcelas.value.map((parcela) => ({
        gasto_id: gastoId,
        parcelas: parcela.parcelas,
        numero_parcela: parcela.numero_parcela,
        valor_parcela: parcela.valor_parcela_parcela,
        data_parcela: convertDateToApi(parcela.data_parcela),
      }));

    const handlerSubmit = async () => {
      const isFormValid = await formRef.value?.validate?.();
      if (!isFormValid) return;

      if (!validateParcelas()) return;

      try {
        let gastoId = isUpdate.value;

        const gastoPayload = buildGastoPayload();

        if (isUpdate.value) {
          await api.patch(`gastos/${gastoId}`, gastoPayload);
          // await api.delete(`gastos/${gastoId}/parcelas`);
        } else {
          const response = await api.post('gastos', gastoPayload);
          gastoId = response.data.id;
        }

        const parcelasPayload = buildParcelasPayload(gastoId);

        await api.post('parcelas/lote', {
          parcelas: parcelasPayload
        });

        notifySuccess(isUpdate.value ? 'Gasto e parcelas atualizados com sucesso' : 'Gasto e parcelas salvos com sucesso');
        router.push({ name: 'gastos' });
      } catch (error) {
        notifyError(error.response?.data?.message || error.message);
      }
    };

    onMounted(() => {
      handleGetCardBanks();
      handleGetSegmentos();

      if (isUpdate.value) {
        handleGetGasto(isUpdate.value);
      } else {
        form.value.total = 0;
        parcelas.value[0].data_parcela = calculateFirstParcelDate(form.value.datagasto);
      }
    });

    return {
      formRef,
      form,
      parcelas,
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