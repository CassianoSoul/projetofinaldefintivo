/* licoes.js: textos de ensino do jogo (Hora da Mentoria, Guia das áreas e fatos do dia a dia).
   Blocos aceitos: p, list, chips, gloss (pares termo/explicação) e tip. */

/* Frases curtas mostradas depois de cada acerto. */
const FATOS = {
  fin: [
    'Toda nota fiscal é conferida antes de virar pagamento.',
    'Conciliação bancária é comparar o extrato do banco com os registros da empresa.',
    'Pagar em dia evita multa e juros e mantém a boa relação com fornecedores.'
  ],
  rh: [
    'O DP calcula a folha com base no ponto, nas férias e nos benefícios.',
    'Atestados entram na ficha do colaborador e são sigilosos.',
    'Na admissão, o RH confere um por um os documentos de quem vai começar.'
  ],
  jur: [
    'Um contrato só deve ser assinado depois que o Jurídico revisa as cláusulas.',
    'Prazo de processo perdido pode custar caro, por isso intimação vai direto ao Jurídico.',
    'A ata registra por escrito o que foi decidido em reuniões e assembleias.'
  ],
  log: [
    'O canhoto assinado prova que a mercadoria chegou ao cliente.',
    'No recebimento, a Logística confere se o que chegou bate com a nota fiscal.',
    'O romaneio é a lista do que está dentro do caminhão.'
  ],
  com: [
    'Compras pede cotações a mais de um fornecedor para comparar preço e prazo.',
    'Antes de comprar, o setor faz o pedido por uma requisição.',
    'O menor preço nem sempre ganha: prazo e qualidade também contam.'
  ]
};

const LESSONS = [
  {
    id: 'adm', dep: null, badge: 'ADM', kicker: 'A área', title: 'O que é a área administrativa?',
    blocks: [
      { type: 'p', text: 'A área administrativa é o apoio que mantém a empresa funcionando. Ela cuida para que documentos, dinheiro, pessoas, compras e entregas andem do jeito certo e cada time consiga fazer o seu trabalho.' },
      { type: 'list', label: 'O que se faz nela', items: [
        'Receber, conferir e encaminhar documentos (protocolo).',
        'Guardar e organizar arquivos, no papel e no computador.',
        'Atender telefone, e-mail e visitantes.',
        'Controlar agendas, prazos e material de escritório.',
        'Conversar com todos os outros departamentos.'
      ] },
      { type: 'chips', label: 'Cargos para começar', items: ['Jovem aprendiz administrativo', 'Auxiliar administrativo', 'Auxiliar de arquivo', 'Assistente de protocolo', 'Recepcionista'] },
      { type: 'gloss', label: 'Palavras da área', items: [
        ['Protocolo', 'Registro de quando um documento chegou e para onde ele foi.'],
        ['Arquivo corrente', 'Documentos usados todos os dias, que ficam à mão.'],
        ['Arquivo permanente', 'Documentos guardados de forma definitiva por seu valor histórico ou legal.']
      ] },
      { type: 'tip', label: 'Dica de aprendiz', text: 'Quem organiza bem hoje evita correria amanhã. Dê nomes claros aos arquivos, com data e assunto, como 2026-11_nota-fiscal_limpa-bem.pdf.' }
    ]
  },
  {
    id: 'fin', dep: 'fin', badge: 'FIN', kicker: 'Departamento 1', title: 'Financeiro',
    blocks: [
      { type: 'p', text: 'O Financeiro cuida do dinheiro da empresa: o que entra, o que sai e se o caixa fecha no fim do mês.' },
      { type: 'chips', label: 'O que passa por lá', items: ['Nota fiscal', 'Boleto', 'Comprovante de pagamento', 'Extrato bancário', 'Reembolso', 'Duplicata', 'Fluxo de caixa'] },
      { type: 'list', label: 'Um dia na área', items: [
        'Contas a pagar: conferir a nota, programar o pagamento e guardar o comprovante.',
        'Contas a receber: emitir a cobrança e acompanhar se o cliente pagou.',
        'Conciliação: comparar o extrato do banco com os registros, linha por linha.',
        'Fluxo de caixa: prever quanto vai entrar e sair nas próximas semanas.'
      ] },
      { type: 'chips', label: 'Cargos para começar', items: ['Jovem aprendiz financeiro', 'Auxiliar financeiro', 'Assistente de contas a pagar', 'Assistente de contas a receber', 'Analista financeiro'] },
      { type: 'gloss', label: 'Palavras da área', items: [
        ['Contas a pagar', 'Tudo o que a empresa precisa pagar a fornecedores e outros.'],
        ['Contas a receber', 'Tudo o que os clientes ainda devem pagar à empresa.'],
        ['Conciliação bancária', 'Conferir se o extrato do banco bate com os registros da empresa.'],
        ['Fluxo de caixa', 'Controle e previsão do dinheiro que entra e sai.']
      ] },
      { type: 'tip', label: 'Dica de aprendiz', text: 'No Financeiro, um número trocado vira prejuízo. Confira valor, data e nome do fornecedor antes de dar o OK.' }
    ]
  },
  {
    id: 'rh', dep: 'rh', badge: 'RH', kicker: 'Departamento 2', title: 'Recursos Humanos',
    blocks: [
      { type: 'p', text: 'O RH cuida das pessoas, desde a abertura da vaga até o desligamento. Uma parte dele, o Departamento Pessoal (DP), cuida da burocracia: ponto, folha, férias, admissão e rescisão. O seu contrato de aprendizagem e os seus documentos de admissão também passam por aqui.' },
      { type: 'chips', label: 'O que passa por lá', items: ['Folha de ponto', 'Atestado médico', 'Solicitação de férias', 'Currículo', 'Holerite', 'Rescisão', 'Avaliação de desempenho'] },
      { type: 'list', label: 'Um dia na área', items: [
        'Recrutamento e seleção: divulgar vagas, receber currículos e marcar entrevistas.',
        'Admissão: reunir os documentos de quem vai começar e registrar o contrato.',
        'Folha de pagamento: calcular salários, descontos e benefícios com base no ponto.',
        'Treinamento e clima: organizar capacitações e acompanhar como as pessoas estão.'
      ] },
      { type: 'chips', label: 'Cargos para começar', items: ['Jovem aprendiz de RH', 'Auxiliar de RH', 'Auxiliar de DP', 'Assistente de recrutamento', 'Analista de RH'] },
      { type: 'gloss', label: 'Palavras da área', items: [
        ['DP', 'Departamento Pessoal: ponto, folha, férias, admissão e rescisão.'],
        ['Admissão', 'Quando a pessoa começa a trabalhar e o contrato é registrado.'],
        ['Holerite', 'Comprovante de pagamento com salário, benefícios e descontos.'],
        ['Rescisão', 'Encerramento do contrato de trabalho.']
      ] },
      { type: 'tip', label: 'Dica de aprendiz', text: 'Documentos do RH têm dados pessoais e são sigilosos. Nunca deixe um holerite ou atestado à vista, nem comente o conteúdo com colegas.' }
    ]
  },
  {
    id: 'jur', dep: 'jur', badge: 'JUR', kicker: 'Departamento 3', title: 'Jurídico',
    blocks: [
      { type: 'p', text: 'O Jurídico protege a empresa dentro da lei: analisa contratos, acompanha processos e ajuda a evitar problemas antes que eles aconteçam.' },
      { type: 'chips', label: 'O que passa por lá', items: ['Contrato', 'Procuração', 'Notificação extrajudicial', 'Ata de assembleia', 'Termo de confidencialidade', 'Intimação judicial', 'Alteração contratual'] },
      { type: 'list', label: 'Um dia na área', items: [
        'Revisar contratos antes de alguém assinar.',
        'Controlar os prazos de processos e intimações.',
        'Guardar os documentos oficiais da empresa, como atas e contrato social.',
        'Orientar os outros departamentos sobre o que pode e o que não pode ser feito.'
      ] },
      { type: 'chips', label: 'Cargos para começar', items: ['Jovem aprendiz jurídico', 'Auxiliar jurídico', 'Assistente jurídico', 'Paralegal', 'Analista jurídico'] },
      { type: 'gloss', label: 'Palavras da área', items: [
        ['Contrato', 'Acordo escrito em que as partes combinam direitos e obrigações.'],
        ['Procuração', 'Documento que autoriza alguém a agir em nome de outra pessoa ou empresa.'],
        ['Ata', 'Registro escrito do que foi decidido em uma reunião ou assembleia.'],
        ['NDA', 'Termo de confidencialidade: compromisso de não divulgar informações.']
      ] },
      { type: 'tip', label: 'Dica de aprendiz', text: 'No Jurídico, prazo é sagrado. Se chegar uma intimação ou notificação, entregue na hora, mesmo que pareça simples.' }
    ]
  },
  {
    id: 'log', dep: 'log', badge: 'LOG', kicker: 'Departamento 4', title: 'Logística',
    blocks: [
      { type: 'p', text: 'A Logística leva o produto certo, na quantidade certa, ao lugar certo e na hora certa. Cuida de recebimento, estoque, separação, expedição e transporte.' },
      { type: 'chips', label: 'O que passa por lá', items: ['CT-e', 'Romaneio', 'MDF-e', 'Ordem de coleta', 'Canhoto de entrega', 'Packing list', 'Checklist de veículo', 'Ordem de separação'] },
      { type: 'list', label: 'Um dia na área', items: [
        'Recebimento: conferir se o que chegou bate com a nota fiscal.',
        'Armazenagem: guardar cada item no endereço certo (rua, prateleira, nível).',
        'Separação e expedição: montar o pedido, embalar e carregar o veículo.',
        'Transporte: acompanhar a rota e guardar o canhoto assinado, que prova a entrega.'
      ] },
      { type: 'chips', label: 'Cargos para começar', items: ['Jovem aprendiz de logística', 'Auxiliar de estoque', 'Conferente', 'Assistente de expedição', 'Analista de transporte'] },
      { type: 'gloss', label: 'Palavras da área', items: [
        ['CT-e', 'Conhecimento de Transporte Eletrônico, o documento fiscal do frete.'],
        ['MDF-e', 'Manifesto Eletrônico de Documentos Fiscais, que reúne as notas de uma carga no mesmo veículo.'],
        ['Romaneio', 'Lista dos volumes e produtos que vão em uma carga.'],
        ['Canhoto', 'Parte da nota fiscal que o cliente assina ao receber a mercadoria.']
      ] },
      { type: 'tip', label: 'Dica de aprendiz', text: 'Conferir é a palavra-chave. Um item errado no caminhão vira frete de volta, atraso e cliente insatisfeito.' }
    ]
  },
  {
    id: 'com', dep: 'com', badge: 'COM', kicker: 'Departamento 5', title: 'Compras',
    blocks: [
      { type: 'p', text: 'Compras garante que a empresa tenha o que precisa, da caneta ao caminhão, com preço justo, boa qualidade e prazo certo.' },
      { type: 'chips', label: 'O que passa por lá', items: ['Pedido de compra', 'Cotação', 'Requisição de material', 'Mapa comparativo', 'Cadastro de fornecedor', 'RFQ', 'Avaliação de fornecedor'] },
      { type: 'list', label: 'Um dia na área', items: [
        'Receber as requisições dos setores: quem precisa de quê e para quando.',
        'Pedir cotações a vários fornecedores e montar o mapa comparativo.',
        'Negociar preço, prazo e forma de pagamento.',
        'Emitir o pedido de compra e acompanhar a entrega.'
      ] },
      { type: 'chips', label: 'Cargos para começar', items: ['Jovem aprendiz de compras', 'Auxiliar de compras', 'Assistente de compras', 'Comprador', 'Analista de suprimentos'] },
      { type: 'gloss', label: 'Palavras da área', items: [
        ['Requisição', 'Pedido interno de um setor para comprar algo.'],
        ['Cotação', 'Proposta de preço e prazo enviada por um fornecedor.'],
        ['RFQ', 'Request for Quotation, o pedido de cotação enviado aos fornecedores.'],
        ['Pedido de compra', 'Documento que formaliza a compra com o fornecedor escolhido.']
      ] },
      { type: 'tip', label: 'Dica de aprendiz', text: 'O menor preço nem sempre é a melhor compra. Compare prazo de entrega, qualidade e confiança no fornecedor. Muitas empresas exigem pelo menos três cotações.' }
    ]
  },
  {
    id: 'sigilo', tipo: 'dica', dep: null, badge: 'DICA', kicker: 'Dica de carreira', title: 'Sigilo e LGPD',
    blocks: [
      { type: 'p', text: 'Documentos trazem dados de pessoas e da empresa: CPF, salário, endereço, contratos. A regra de ouro é mexer só no que você precisa e mostrar só para quem precisa.' },
      { type: 'list', label: 'Na prática', items: [
        'Não deixe papéis com dados à vista na mesa.',
        'Não fotografe nem envie documentos por aplicativo de conversa sem autorização.',
        'Bloqueie a tela do computador quando sair do lugar.'
      ] },
      { type: 'tip', label: 'Você sabia?', text: 'A LGPD (Lei Geral de Proteção de Dados) protege os dados pessoais de todo mundo, inclusive os seus.' }
    ]
  },
  {
    id: 'conferir', tipo: 'dica', dep: null, badge: 'DICA', kicker: 'Dica de carreira', title: 'Confira antes de passar adiante',
    blocks: [
      { type: 'p', text: 'Um documento com erro que segue adiante só aumenta o problema. Faça uma checagem rápida antes de encaminhar.' },
      { type: 'list', label: 'Checklist de 20 segundos', items: [
        'Nome e CPF ou CNPJ estão certos?',
        'Data e valor estão corretos?',
        'Tem assinatura ou carimbo, quando precisa?',
        'Os anexos estão completos?',
        'Está indo para o departamento certo?'
      ] },
      { type: 'tip', label: 'Dica de aprendiz', text: 'Se algo não bater, avise quem enviou antes de arquivar. Isso evita retrabalho para todo mundo.' }
    ]
  },
  {
    id: 'duvida', tipo: 'dica', dep: null, badge: 'DICA', kicker: 'Dica de carreira', title: 'Na dúvida, pergunte',
    blocks: [
      { type: 'p', text: 'Perguntar mostra responsabilidade. Errar por vergonha de perguntar custa bem mais.' },
      { type: 'list', label: 'Como perguntar bem', items: [
        'Diga o que você já entendeu e onde travou.',
        'Seja específico: "Este documento é do Financeiro ou de Compras?"',
        'Anote a resposta para não precisar perguntar de novo.'
      ] },
      { type: 'tip', label: 'Dica de aprendiz', text: 'Quem pergunta no começo aprende mais rápido, e a equipe percebe o seu interesse.' }
    ]
  },
  {
    id: 'digital', tipo: 'dica', dep: null, badge: 'DICA', kicker: 'Dica de carreira', title: 'Organização digital',
    blocks: [
      { type: 'p', text: 'Boa parte do arquivo hoje é digital. Sem padrão, achar um documento vira caça ao tesouro.' },
      { type: 'list', label: 'Boas práticas', items: [
        'Use nomes claros, com data, assunto e origem.',
        'Separe pastas por ano, mês e departamento.',
        'Evite nomes como "final_agora_vai_2".',
        'Mantenha cópia de segurança dos arquivos importantes.'
      ] },
      { type: 'tip', label: 'Teste rápido', text: 'Se um colega encontraria o seu arquivo em 30 segundos, a organização está boa.' }
    ]
  },
  {
    id: 'prazo', tipo: 'dica', dep: null, badge: 'DICA', kicker: 'Dica de carreira', title: 'Prazo e prioridade',
    blocks: [
      { type: 'p', text: 'Urgente é o que vence primeiro, não o que alguém pede com mais pressa. Anotar os prazos é metade do trabalho.' },
      { type: 'list', label: 'Como se organizar', items: [
        'Anote o prazo na agenda assim que receber a tarefa.',
        'Comece pelo que vence antes e pelo que afeta mais gente.',
        'Se for atrasar, avise cedo e informe uma nova previsão.'
      ] },
      { type: 'tip', label: 'Dica de aprendiz', text: 'Pontualidade e aviso antecipado constroem confiança, e isso vale tanto quanto a habilidade técnica.' }
    ]
  }
];

/* Ordem das lições na Hora da Mentoria (uma por nível, repete no fim). */
const MENTOR_ORDER = ['adm', 'fin', 'rh', 'jur', 'log', 'com', 'sigilo', 'conferir', 'duvida', 'digital', 'prazo'];
