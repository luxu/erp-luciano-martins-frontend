import { ref } from 'vue';

// Este mapa pode ser definido fora do seu componente (como uma constante)
const opcoesMapa = {
  'C': 'Crédito',
  'D': 'Débito',
  'T': 'Transferência'
};

const columns = [
  {
    name: 'id',
    label: 'ID',
    align: 'left',
    field: (val) => val.id,
    sortable: true,
  },
  {
    name: 'name',
    label: 'Nome',
    align: 'left',
    field: (val) => val.name,
    sortable: true,
  },
  {
    name: 'datagasto',
    label: 'Datagasto',
    align: 'left',
    field: (val) => val.datagasto,
    sortable: true,
  },
  {
    name: 'segmento',
    label: 'Segmento',
    align: 'left',
    field: (val) => val.segmento.name,
    sortable: true,
  },
  {
    name: 'card_bank',
    label: 'Banco do cartão',
    align: 'left',
    field: (val) => val.card_bank.name,
    sortable: true,
  },
  {
    name: 'opcoes_cartao',
    label: 'Tipo de pagamento',
    align: 'left',
    field: (val) => val.opcoes_cartao,
    sortable: true,
    // 💡 Função de formatação: Recebe o valor original e retorna o valor mapeado
    format: (val) => opcoesMapa[val] || val // Tenta mapear, se não encontrar, retorna o valor original
  },
  {
    name: 'total',
    label: 'Total',
    align: 'left',
    field: (val) => val.total,
    sortable: true,
  },
  // {
  //   name: 'description_on_invoice',
  //   label: 'Descrição na fatura',
  //   align: 'left',
  //   field: (val) => val.description_on_invoice,
  //   sortable: true,
  // },
  // {
  //   name: 'more_infos',
  //   label: 'Infos Complementares',
  //   align: 'left',
  //   field: (val) => val.more_infos,
  //   sortable: true,
  //   // 💡 Função de formatação: Recebe o valor original e retorna o valor mapeado
  //   format: (val) => opcoesMapa[val] || val // Tenta mapear, se não encontrar, retorna o valor original
  // },
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
