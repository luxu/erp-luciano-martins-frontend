<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
      title="Lista de Cartões"
      :rows="rows"
      :columns="columns"
      row-key="uid"
      class="col-12"
      :loading="loading"
      >
        <template v-slot:top-right>
          <q-btn
            color="primary"
            label="Adicionar Cartões"
            icon="add"
            :to="{ name: 'form-cardbank' }"
          />
        </template>
        <template v-slot:body-cell-description="props">
          <q-td :props="props">
            <div>
              <q-badge color="purple" :label="props.value" />
            </div>
            <div class="my-table-details">
              {{ props.row.description }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="mdi-pencil-outline"
              color="info"
              dense
              size="sm"
              @click="handlerEdit(props.row)"
            >
              <q-tooltip>
                Edit
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="mdi-delete-outline"
              color="negative"
              dense
              size="sm"
              @click="handlerRemove(props.row)"
            >
              <q-tooltip>
                Delete
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { columns } from './table';
// import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import useNotify from 'src/composables/UseNotify';

export default defineComponent({
  name: 'GastosPage',
  setup () {
    const form = ref({
      id: '',
      name: '',
    })
    const rows = ref([
          { 'id': 1, 'name': 'BB'},
          { 'id': 2, 'name': 'Itaú'},
          { 'id': 3, 'name': 'BB-Zenaide'},
    ])
    const loading = ref(false);
    const router = useRouter();
    // const { notifyError, notifySuccess } = useNotify();
    // const $q = useQuasar();

    const handlerGetList = async () => {
      try {
        loading.value = true;
        // const { data } = await api.get('pagamentos');
        // rows.value = data.data.map((product) => ({
        //   uid: product.uid,
        //   ...product.attributes,
        // }));
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    return {
      form,
      loading,
      columns,
      rows,
      router,
      handlerGetList
    }
  }
})
</script>
