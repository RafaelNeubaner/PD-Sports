# PD Sports - E-commerce Esportivo

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)


## 📝 Descrição do Projeto
A **PD Sports** é um MVP (Minimum Viable Product) de uma plataforma de e-commerce de alto desempenho, focada na comercialização de artigos esportivos. O projeto busca unir uma experiência de usuário (UX) fluida para atletas com uma área administrativa robusta para gestão de catálogo.

O projeto está sendo desenvolvido pela equipe **Q1 Vênus – Manhã**:
* **Pablo Perdigão**
* **Rafael Neubaner**
* **Pedro Manoel**

---

## 🚀 Funcionalidades

### Usuário Final
* **Catálogo Completo:** Navegação por mais de 15 modalidades esportivas.
* **Busca e Filtros:** Pesquisa por nome, filtragem por categoria e ordenação por preço.
* **Detalhes do Produto:** Visualização técnica e específica de cada item.
* **Carrinho Inteligente:** Adição/remoção de itens, alteração de quantidades e cálculo de total em tempo real com persistência de dados.
* **Cálculo de Frete:** Integração com API externa para simulação de prazos e valores.

### Área Administrativa (Restrita)
* **Gestão de Estoque (CRUD):** Cadastro, edição, listagem e exclusão de produtos.
* **Validação de Dados:** Garantia de integridade nas informações inseridas.
* **Dashboard de Controle:** Feedback visual para todas as ações administrativas.

---

## 🛠 Tecnologias Utilizadas
* **Linguagens:** HTML5, CSS3, JavaScript (ES6+)
* **Framework CSS:** Bootstrap 5
* **Persistência de Dados:** MockAPI
* **Comunicação:** Fetch API (Async/Await)
* **Versionamento:** Git & GitHub
* **Hospedagem:** Vercel

---

## 🔌 Integrações e APIs
1.  **MockAPI:** Utilizada para persistência de dados do catálogo e operações de CRUD na área administrativa.
2.  **API Externa (Funcional):** *[Inserir posteriormente o nome da API]*

---

## 🏗 Arquitetura e Padrões

### Padrões de Nomenclatura
Definimos padrões a serem adotados+ para garantir a manutenibilidade do código:
* **Código:** Variáveis, funções e classes utilizam `camelCase`.
* **Estrutura:** Pastas, arquivos e branches utilizam `kebab-case`.

### 🗂️Estrutura de Pastas
```text
📂 PD-Sports/
├── 📂 assets/  # Imagens e ícones
├── 📂 css/     # Arquivos de estilização
│   └── styles.css
├── 📂js/       # Módulos e lógica
│   └── script.js
├── 📂 pages/  # Páginas secundárias (kebab-case)
├── 📄 index.html  # Página principal
└── 📄 README.md   # Arquivo de docs

```

### 🚥 Governança e Fluxo de Trabalho
**Git Flow**
Seguimos o fluxo de branches para organização:

* `main:` Versão de produção (estável).

* `develop:` Integração de novas funcionalidades.

* `feat/*:` Desenvolvimento de funcionalidades específicas.

**Commits (Conventional Commits)**
As mensagens de commit devem seguir o padrão:
*tipo(escopo): descrição objetiva*

* `feat:` Nova funcionalidade.
* `fix:` Correção de erro.
* `docs:` Alteração em documentação.


## 🔗 Links Úteis
* **Repositório:** [PD Sports](https://github.com/RafaelNeubaner/PD-Sports)
* **Protótipos no Figma:** 
  * [Desktop](https://www.figma.com/proto/dsnVBsy7jPQ42vvvIR1yi6/V%C3%AAnus-Manh%C3%A3---PDSports?node-id=210-304&viewport=580%2C514%2C0.22&t=uMqbWiNVKhQ22xVK-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=210%3A2685&show-proto-sidebar=1&page-id=210%3A303)
  * [Mobile](https://www.figma.com/proto/dsnVBsy7jPQ42vvvIR1yi6/V%C3%AAnus-Manh%C3%A3---PDSports?node-id=210-304&viewport=580%2C514%2C0.22&t=uMqbWiNVKhQ22xVK-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=210%3A2685&show-proto-sidebar=1&page-id=210%3A303)

* **Deploy (Vercel):** [Inserir posteriormente o link]

