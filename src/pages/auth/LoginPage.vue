<template>
  <q-page class="row items-center justify-center q-pa-md">
    <q-card class="q-pa-lg" style="min-width: 320px; max-width: 400px;">
      <q-card-section>
        <div class="text-h5 text-primary text-center">ERP Luciano Martins</div>
        <div class="text-h5 text-primary text-center">Login</div>
      </q-card-section>

      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <q-input
          v-model="form.username"
          label="Usuário"
          filled
          required
          autocomplete="username"
        />

        <q-input 
          v-model="form.password"
          filled
          label="Senha"
          :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
        </q-input>

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

const isPwd = ref(true);

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
    const message = error?.response?.data?.detail
           || error?.response?.data?.message
           || 'Não foi possível realizar o login.';
    console.error('Login error:', error);
    notifyError(message);
  } finally {
    submitting.value = false;
  }
};
</script>
