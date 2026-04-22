document.addEventListener('DOMContentLoaded', () => {
  const accordion = document.getElementById('faqAccordion');
  if (!accordion) {
    return;
  }

  const searchInput = document.getElementById('faqSearch');
  const countLabel = document.getElementById('faqCount');
  const emptyState = document.getElementById('faqEmpty');
  const clearButton = document.getElementById('faqClear');
  const filterButtons = Array.from(document.querySelectorAll('.faqFilter'));

  const faqItems = [
    {
      id: 'trocas-1',
      category: 'trocas',
      question: 'Qual o prazo limite que posso trocar ou devolver meu pedido?',
      answer:
        'O prazo para trocas e devoluções por arrependimento segue o Código de Defesa do Consumidor e é de 7 dias corridos após o recebimento do pedido.',
      keywords: ['prazo', 'arrependimento', 'devolução', 'troca'],
    },
    {
      id: 'trocas-2',
      category: 'trocas',
      question: 'Como envio um produto para troca?',
      answer:
        'Depois de solicitar a troca, você recebe por e-mail as instruções de envio, o código de autorização e o endereço de postagem, quando aplicável.',
      keywords: ['envio', 'autorização', 'postagem', 'devolver'],
    },
    {
      id: 'trocas-3',
      category: 'trocas',
      question: 'Posso trocar um produto com a embalagem aberta?',
      answer:
        'Sim, desde que o produto não tenha sinais de uso e esteja com etiquetas, acessórios e itens de segurança preservados.',
      keywords: ['embalagem', 'uso', 'etiqueta', 'acessórios'],
    },
    {
      id: 'entrega-1',
      category: 'entrega',
      question: 'Como acompanho o status da entrega?',
      answer:
        'Você pode acompanhar o status na área de pedidos da sua conta e também pelo link enviado no e-mail de confirmação de envio.',
      keywords: ['rastreamento', 'status', 'pedido', 'acompanhar'],
    },
    {
      id: 'entrega-2',
      category: 'entrega',
      question: 'O prazo de entrega pode mudar depois da compra?',
      answer:
        'Sim. O prazo pode variar conforme o CEP, a transportadora e eventuais ocorrências logísticas informadas após o pedido ser processado.',
      keywords: ['cep', 'transportadora', 'logística', 'frete'],
    },
    {
      id: 'entrega-3',
      category: 'entrega',
      question: 'O que acontece se eu não estiver em casa no momento da entrega?',
      answer:
        'A transportadora pode realizar novas tentativas ou redirecionar a encomenda conforme a política de entrega da modalidade escolhida.',
      keywords: ['ausente', 'tentativa', 'transportadora', 'recebimento'],
    },
    {
      id: 'conta-1',
      category: 'conta',
      question: 'Como faço para atualizar meus dados cadastrais?',
      answer:
        'Entre na área Minha Conta, acesse seu perfil e atualize nome, telefone, endereço e outras informações permitidas.',
      keywords: ['perfil', 'cadastro', 'dados', 'atualizar'],
    },
    {
      id: 'conta-2',
      category: 'conta',
      question: 'Esqueci minha senha. O que devo fazer?',
      answer:
        'Use a opção Esqueci minha senha na tela de login. Você receberá um link por e-mail para redefinir o acesso.',
      keywords: ['senha', 'login', 'e-mail', 'recuperar'],
    },
    {
      id: 'pagamento-1',
      category: 'pagamento',
      question: 'Quais formas de pagamento vocês aceitam?',
      answer:
        'Aceitamos cartão de crédito, cartão de débito, Pix e, quando disponível, outras opções exibidas no checkout.',
      keywords: ['pix', 'cartão', 'débito', 'crédito'],
    },
    {
      id: 'pagamento-2',
      category: 'pagamento',
      question: 'Meu pagamento foi recusado. O que posso fazer?',
      answer:
        'Confira os dados informados, limite disponível e saldo da conta. Se o problema continuar, tente outro meio de pagamento.',
      keywords: ['recusado', 'limite', 'saldo', 'checkout'],
    },
    {
      id: 'cancelamento-1',
      category: 'cancelamento',
      question: 'Posso cancelar um pedido depois de finalizado?',
      answer:
        'O cancelamento depende do estágio de processamento. Se o pedido ainda não tiver sido enviado, é possível solicitar o cancelamento.',
      keywords: ['cancelar', 'processamento', 'enviado', 'pedido'],
    },
    {
      id: 'pedidos-1',
      category: 'pedidos',
      question: 'Onde encontro o histórico dos meus pedidos?',
      answer:
        'O histórico fica disponível na área Meus Pedidos dentro da sua conta, com o resumo, status e detalhes de cada compra.',
      keywords: ['histórico', 'compra', 'status', 'minhas compras'],
    },
    {
      id: 'pedidos-2',
      category: 'pedidos',
      question: 'Consigo alterar o endereço depois de comprar?',
      answer:
        'Se o pedido ainda não tiver sido faturado, você pode solicitar a alteração pelo atendimento ou pela área de pedidos.',
      keywords: ['endereço', 'alterar', 'atendimento', 'faturado'],
    },
    {
      id: 'privacidade-1',
      category: 'privacidade',
      question: 'Como meus dados pessoais são utilizados?',
      answer:
        'Usamos seus dados para processar pedidos, oferecer suporte, melhorar a experiência e cumprir obrigações legais aplicáveis.',
      keywords: ['dados', 'privacidade', 'uso', 'suporte'],
    },
    {
      id: 'privacidade-2',
      category: 'privacidade',
      question: 'Posso solicitar a exclusão da minha conta?',
      answer:
        'Sim. Você pode solicitar a exclusão ou a revisão dos seus dados pelos canais de atendimento, seguindo as regras de retenção legal.',
      keywords: ['exclusão', 'conta', 'lgpd', 'dados'],
    },
  ];

  const state = {
    category: 'all',
    query: '',
    openId: null,
    autoOpenFirst: true,
  };

  const escapeHtml = (value) =>
    value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  const normalizeText = (value) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const filteredItems = () => {
    const query = normalizeText(state.query.trim());

    return faqItems.filter((item) => {
      const matchesCategory = state.category === 'all' || item.category === state.category;
      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = normalizeText([
        item.question,
        item.answer,
        item.keywords.join(' '),
      ].join(' '));

      return haystack.includes(query);
    });
  };

  const renderFilters = () => {
    filterButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.category === state.category);
      button.setAttribute('aria-pressed', String(button.dataset.category === state.category));
    });
  };

  const renderFaq = () => {
    const items = filteredItems();
    const shouldOpenFirst =
      state.autoOpenFirst && items.length > 0 && !items.some((item) => item.id === state.openId);

    if (shouldOpenFirst) {
      state.openId = items.length > 0 ? items[0].id : null;
    }

    state.autoOpenFirst = false;

    accordion.innerHTML = items
      .map((item) => {
        const isOpen = item.id === state.openId;

        return `
          <article class="faqItem ${isOpen ? 'open' : ''}" data-id="${item.id}">
            <button class="faqQuestion" type="button" aria-expanded="${isOpen ? 'true' : 'false'}">
              <span>${escapeHtml(item.question)}</span>
              <i class="bi bi-chevron-down"></i>
            </button>
            <div class="faqAnswer">
              <p>${escapeHtml(item.answer)}</p>
            </div>
          </article>
        `;
      })
      .join('');

    countLabel.textContent = `${items.length} ${items.length === 1 ? 'pergunta encontrada' : 'perguntas encontradas'}`;
    emptyState.classList.toggle('d-none', items.length !== 0);
  };

  const applyState = () => {
    renderFilters();
    renderFaq();
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.category = button.dataset.category || 'all';
      state.openId = null;
      state.autoOpenFirst = true;
      applyState();
    });
  });

  searchInput.addEventListener('input', (event) => {
    state.query = event.target.value;
    state.openId = null;
    state.autoOpenFirst = true;
    applyState();
  });

  clearButton.addEventListener('click', () => {
    state.category = 'all';
    state.query = '';
    state.openId = null;
    state.autoOpenFirst = true;
    searchInput.value = '';
    applyState();
    searchInput.focus();
  });

  accordion.addEventListener('click', (event) => {
    const button = event.target.closest('.faqQuestion');
    if (!button) {
      return;
    }

    const item = button.closest('.faqItem');
    if (!item) {
      return;
    }

    const itemId = item.dataset.id;
    state.openId = state.openId === itemId ? null : itemId;
    applyState();
  });

  applyState();
});
