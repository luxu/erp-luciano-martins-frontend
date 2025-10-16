<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-table
      title="Lista de Segmentos"
      :rows="rows"
      :columns="columns"
      row-key="uid"
      class="col-12"
      :loading="loading"
      >
        <template v-slot:top-right>
          <q-btn
            color="primary"
            label="Adicionar Segmento"
            icon="add"
            :to="{ name: 'form-cardbank' }"
          />
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
import { defineComponent, ref, onMounted } from 'vue'
import { columns } from './table';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import useNotify from 'src/composables/UseNotify';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'GastosPage',
  setup () {
    const form = ref({
      id: '',
      name: '',
    })
    const rows = ref([])
    const loading = ref(false);
    const router = useRouter();
    const { notifyError, notifySuccess } = useNotify();
    const $q = useQuasar();

    const handlerGetList = async () => {
      try {
        loading.value = true;
        const { data } = await api.get('cardbanks');
        rows.value = data.map((cardbank) => ({
          id: cardbank.id,
          ...cardbank,
        }));
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handlerEdit = (cardbank) => {
      router.push({ name: 'form-cardbank', params: { id: cardbank.id } })
    }

    const handlerRemove = async (cardbank) => {
      const description = cardbank.name || 'CARTÃO INEXISTENTE'
      try {
        $q.dialog({
          title: 'Confirm',
          message: `Do you really delete ${description}`,
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await api.delete(`cardbanks/${cardbank.id}`);
          notifySuccess('Successfully deleted');
          handlerGetList();
        });
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      handlerGetList();
    });

    return {
      form,
      columns,
      rows,
      loading,
      handlerGetList,
      handlerEdit,
      handlerRemove,
    }
  }
})
</script>
