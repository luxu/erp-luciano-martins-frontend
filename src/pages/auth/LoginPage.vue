<template>
  <q-page class="row items-center justify-center q-pa-md">
    <q-card class="q-pa-lg" style="min-width: 320px; max-width: 400px;">
      <q-card-section>
        <div class="text-h5 text-primary text-center">Entrar</div>
      </q-card-section>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          v-model="form.username"
          label="Usuário"
          outlined
          required
          autocomplete="username"
        />

        <q-input
          v-model="form.password"
          label="Senha"
          type="password"
          outlined
          required
          autocomplete="current-password"
        />

        <div class="row justify-end q-gutter-sm">
          <q-btn
            label="Entrar"
            type="submit"
            color="primary"
            :loading="submitting"
            unelevated
          />
        </div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import useAuthUser from '../../composables/UseAuthUser';
import useNotify from '../../composables/UseNotify';

const router = useRouter();
const authUser = useAuthUser();
const { notifySuccess, notifyError } = useNotify();

const form = reactive({
  username: '',
  password: '',
});

const submitting = ref(false);

const onSubmit = async () => {
  if (submitting.value) {
    return;
  }

  submitting.value = true;
  try {
    await authUser.login({ ...form });
    notifySuccess('Login realizado com sucesso.');
    router.push('/');
  } catch (error) {
    const message = error?.response?.data?.detail || 'Não foi possível realizar o login.';
    notifyError(message);
  } finally {
    submitting.value = false;
  }
};
</script>
