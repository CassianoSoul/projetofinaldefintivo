/* conteudo.js: departamentos e documentos do jogo. Edite aqui para trocar os documentos. */
const ORDER = ['fin', 'rh', 'jur', 'log', 'com'];
const DEPTS = {
  fin: { nome: 'Financeiro', desc: 'Dinheiro entrando e saindo: notas, boletos, extratos e reembolsos.' },
  rh:  { nome: 'RH', desc: 'Pessoas: ponto, férias, atestados, admissão e desligamento.' },
  jur: { nome: 'Jurídico', desc: 'Contratos, procurações, notificações e processos.' },
  log: { nome: 'Logística', desc: 'Cargas e entregas: transporte, romaneio, coleta e canhotos.' },
  com: { nome: 'Compras', desc: 'Fornecedores: pedidos, cotações e requisições de material.' }
};

const DOCS = [
  // Financeiro
  { t: 'Nota Fiscal de Serviço', d: 'fin', f: [['Emitente', 'Limpa Bem Serviços'], ['Valor', 'R$ 3.480,00']], tip: 'Nota de serviço vira conta a pagar, e isso é com o Financeiro.' },
  { t: 'Boleto de Cobrança', d: 'fin', f: [['Beneficiário', 'Papelaria Central'], ['Vencimento', '25/11']], tip: 'Boleto é pagamento a programar. Vai para o Financeiro.' },
  { t: 'Comprovante de Pagamento', d: 'fin', f: [['Tipo', 'Transferência PIX'], ['Valor', 'R$ 12.900,00']], tip: 'Comprovantes de pagamento são guardados pelo Financeiro.' },
  { t: 'Extrato Bancário', d: 'fin', f: [['Conta', 'Corrente 01'], ['Período', 'Outubro']], tip: 'Extratos servem para conciliar as contas, no Financeiro.' },
  { t: 'Pedido de Reembolso', d: 'fin', f: [['Solicitante', 'Equipe Comercial'], ['Despesa', 'Táxi e almoço']], tip: 'Mesmo vindo de um colaborador, quem paga o reembolso é o Financeiro.' },
  { t: 'Duplicata a Receber', d: 'fin', f: [['Cliente', 'Mercado Bom Preço'], ['Valor', 'R$ 8.750,00']], tip: 'Cobrança de cliente é contas a receber, no Financeiro.' },
  { t: 'Fluxo de Caixa Semanal', d: 'fin', f: [['Semana', '46'], ['Saldo previsto', 'R$ 41.300,00']], tip: 'Projeção de entradas e saídas é trabalho do Financeiro.' },
  // RH
  { t: 'Folha de Ponto', d: 'rh', f: [['Colaborador', 'M. Andrade'], ['Mês', 'Outubro']], tip: 'Controle de jornada fica com o RH.' },
  { t: 'Atestado Médico', d: 'rh', f: [['Colaborador', 'R. Souza'], ['Afastamento', '2 dias']], tip: 'Atestados entram na ficha do colaborador, no RH.' },
  { t: 'Solicitação de Férias', d: 'rh', f: [['Colaborador', 'T. Lima'], ['Período', '08/12 a 27/12']], tip: 'Férias são programadas pelo RH.' },
  { t: 'Currículo de Candidato', d: 'rh', f: [['Vaga', 'Auxiliar Administrativo'], ['Candidata', 'J. Prado']], tip: 'Seleção de pessoas é com o RH.' },
  { t: 'Holerite', d: 'rh', f: [['Colaborador', 'C. Matos'], ['Líquido', 'R$ 2.915,40']], tip: 'Folha de pagamento e holerites são do RH.' },
  { t: 'Termo de Rescisão', d: 'rh', f: [['Colaborador', 'P. Nunes'], ['Motivo', 'Pedido de demissão']], tip: 'Desligamentos são conduzidos pelo RH.' },
  { t: 'Avaliação de Desempenho', d: 'rh', f: [['Colaborador', 'L. Ferraz'], ['Ciclo', '2º semestre']], tip: 'Avaliações de equipe ficam no RH.' },
  // Jurídico
  { t: 'Contrato de Prestação de Serviços', d: 'jur', f: [['Partes', 'Nossa empresa e Alfa TI'], ['Prazo', '24 meses']], tip: 'Contratos são revisados e guardados pelo Jurídico.' },
  { t: 'Procuração', d: 'jur', f: [['Outorgante', 'Diretoria'], ['Poderes', 'Representar em cartório']], tip: 'Procurações são documentos jurídicos.' },
  { t: 'Notificação Extrajudicial', d: 'jur', f: [['Remetente', 'Escritório Pires'], ['Resposta em', '10 dias']], tip: 'Notificações com prazo legal vão direto para o Jurídico.' },
  { t: 'Ata de Assembleia', d: 'jur', f: [['Pauta', 'Aprovação de contas'], ['Data', '14/11']], tip: 'Atas societárias são registradas pelo Jurídico.' },
  { t: 'Termo de Confidencialidade', d: 'jur', f: [['Partes', 'Nossa empresa e Beta Dados'], ['Vigência', '5 anos']], tip: 'NDA é instrumento jurídico.' },
  { t: 'Intimação Judicial', d: 'jur', f: [['Vara', '3ª Vara Cível'], ['Prazo', '15 dias úteis']], tip: 'Qualquer intimação judicial é urgente para o Jurídico.' },
  { t: 'Alteração Contratual', d: 'jur', f: [['Ato', 'Mudança de endereço'], ['Registro', 'Junta Comercial']], tip: 'Alterações do contrato social são tratadas pelo Jurídico.' },
  // Logística
  { t: 'Conhecimento de Transporte (CT-e)', d: 'log', f: [['Origem', 'São Paulo/SP'], ['Destino', 'Curitiba/PR']], tip: 'O CT-e acompanha a carga e fica com a Logística.' },
  { t: 'Romaneio de Carga', d: 'log', f: [['Volumes', '48 caixas'], ['Peso', '1.320 kg']], tip: 'Romaneio lista o que está no caminhão, é da Logística.' },
  { t: 'Manifesto de Carga (MDF-e)', d: 'log', f: [['Veículo', 'Placa ABC-1D23'], ['Rota', 'SP a PR']], tip: 'Manifesto de carga é documento de transporte.' },
  { t: 'Ordem de Coleta', d: 'log', f: [['Coleta', 'Doca 4, 14h'], ['Transportadora', 'Rota Sul']], tip: 'Agendar coleta é rotina da Logística.' },
  { t: 'Canhoto de Entrega', d: 'log', f: [['Recebido por', 'Armazém Norte'], ['Data', '12/11']], tip: 'O canhoto prova que a entrega aconteceu. Fica na Logística.' },
  { t: 'Packing List', d: 'log', f: [['Itens', '12 paletes'], ['Embarque', 'Porto de Santos']], tip: 'Lista de embarque pertence à Logística.' },
  { t: 'Checklist de Inspeção de Veículo', d: 'log', f: [['Veículo', 'Baú 7'], ['Itens', '22 verificados']], tip: 'Inspeção da frota é com a Logística.' },
  { t: 'Ordem de Separação', d: 'log', f: [['Pedido', '7731'], ['Local', 'Corredor C, prateleira 3']], tip: 'Separar mercadoria no estoque é função da Logística.' },
  // Compras
  { t: 'Pedido de Compra', d: 'com', f: [['Fornecedor', 'Papelaria Central'], ['Itens', '20 resmas A4']], tip: 'Pedidos a fornecedores são emitidos por Compras.' },
  { t: 'Cotação de Fornecedor', d: 'com', f: [['Fornecedor', 'Distribuidora Alfa'], ['Validade', '15 dias']], tip: 'Cotações recebidas ficam com Compras.' },
  { t: 'Requisição de Material', d: 'com', f: [['Setor', 'Expedição'], ['Item', '200 fitas adesivas']], tip: 'Quando um setor pede material, a requisição vai para Compras.' },
  { t: 'Mapa Comparativo de Cotações', d: 'com', f: [['Propostas', '3 fornecedores'], ['Menor preço', 'R$ 4.210,00']], tip: 'Comparar propostas é o trabalho de Compras.' },
  { t: 'Cadastro de Fornecedor', d: 'com', f: [['Razão social', 'Embalagens Sol'], ['CNPJ', '00.000.000/0001-00']], tip: 'Fornecedores novos são cadastrados por Compras.' },
  { t: 'Pedido de Cotação (RFQ)', d: 'com', f: [['Item', 'Paletes PBR'], ['Quantidade', '300']], tip: 'Pedir preços aos fornecedores é com Compras.' },
  { t: 'Avaliação de Fornecedor', d: 'com', f: [['Fornecedor', 'Distribuidora Alfa'], ['Nota', '8,7']], tip: 'Avaliar fornecedores é função de Compras.' }
];

const RANKS = [
  [0, 'Estágio no Protocolo'], [50, 'Auxiliar Administrativo'], [90, 'Assistente de Logística'],
  [120, 'Analista de Processos'], [145, 'Coordenação de Operações'], [160, 'Diretoria do Arquivo Central']
];
