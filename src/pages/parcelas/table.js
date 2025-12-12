import { ref } from 'vue';

const columns = [
  {
    name: 'id',
    label: 'ID',
    align: 'left',
    field: (val) => val.id,
    sortable: true,
  },
  {
    name: 'gasto',
    label: 'Gasto',
    align: 'left',
    field: (val) => val.gasto,
    sortable: true,
  },
  {
    name: 'parcelas',
    label: 'Parcelas',
    align: 'left',
    field: (val) => val.parcelas,
    sortable: true,
  },
  {
    name: 'numero_parcela',
    label: 'Nro Parcelas',
    align: 'left',
    field: (val) => val.numero_parcela,
    sortable: true,
  },
  {
    name: 'valor_parcela',
    label: 'Valor da Parcela',
    align: 'left',
    field: (val) => val.valor_parcela,
    sortable: true,
  },
  {
    name: 'data_parcela',
    label: 'Data da Parcela',
    align: 'left',
    field: (val) => val.data_parcela,
    sortable: true,
  },
  {
    name: 'actions',
    align: 'right',
    label: 'Actions',
    field: 'actions',
    sortable: false,
  },
];



const initialPagination = ref({
  page: 1,
  rowsPerPage: 8,
});

export {
  columns,
  initialPagination,
};
