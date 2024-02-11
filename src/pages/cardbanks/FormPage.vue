<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          Form CardBank
        </p>
      </div>
      <div class="q-pa-md" style="max-width: 300px">
        <q-form class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md" @submit.prevent="handlerSubmit">
          <q-input
            label="Nome do Cartão"
            outlined
            class="col-xs-12 col-sm-12 col-md-8 col-lg-7"
            v-model="form.description"
            :rules="requiredRules"
          />
          <div class="col-xs-12 col-sm-12 col-md-8 col-lg-7 q-mt-md">
            <q-btn
              :label="isUpdate ? 'Update' : 'Save'"
              type="submit"
              color="primary"
              class="float-right"
            />
            <q-btn
              label="Cancelar"
              type="submit"
              color="white"
              class="text-black float-right q-mr-md"
              :to="{ name: 'cardbanks' }"
            />
          </div>
        </q-form>
      </div>
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
  name: 'FormPage',
  setup() {
    const form = ref({
      name: '',
    });
    const router = useRouter();
    const route = useRoute();
    const { notifyError, notifySuccess } = useNotify();
    const requiredRules = [
      (val) => (val && val.length > 0) || 'Este campo é obrigatório',
    ];
    const isUpdate = computed(() => route.params.id);

    const handleGetProduct = async (id) => {
      try {
        const product = await api.get(`pagamentos/${id}`);
        form.value = product.data.data;
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handlerSubmit = async () => {
      const { description } = form.value;
      const price = parseFloat(form.value.price);
      const quantity = parseInt(form.value.quantity, 10);
      const payload = {
        description,
        price,
        quantity,
      };
      try {
        if (isUpdate.value) {
          await api.patch(`pagamentos/${isUpdate.value}`, payload);
          notifySuccess('Update Successfully');
        } else {
          await api.post('pagamentos', payload);
          notifySuccess('Saved Successfully');
        }
        router.push({ name: 'pagamento' });
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      if (isUpdate.value) {
        handleGetProduct(isUpdate.value);
      }
    });

    return {
      form,
      requiredRules,
      handlerSubmit,
      isUpdate,
    };
  },
});

</script>
