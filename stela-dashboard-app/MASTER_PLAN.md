# 🏛️ PROJETO STELA: Memorial Descritivo e Plano de Implementação Master

Este documento é a especificação técnica e funcional definitiva para o Dashboard Ferreira Dist. Ele detalha a infraestrutura, a origem milimétrica de cada dado e as fórmulas matemáticas (Memorial de Cálculo) utilizadas em cada uma das três apresentações.

---

## 🏗️ 1. Infraestrutura e Arquitetura de Software

A solução foi construída seguindo os mais altos padrões de engenharia de software frontend para garantir performance e escalabilidade.

*   **Core:** React.js 18 no ambiente Vite.
*   **Design System:** Material UI 5.0 (Baseado no template *Material Dashboard 2 Pro* da Creative Tim).
*   **Engine de Dados:** `SheetJS (XLSX)` para parsing binário de arquivos Excel diretamente no navegador sem necessidade de banco de dados SQL.
*   **Visualização:** `ApexCharts` para renderização de gráficos vetoriais (SVG) de alto desempenho.
*   **Arquitetura de Componentes:** Divisão por departamentos (`ComercialDashboard`, `FinanceiroDashboard`, `PessoalDashboard`) para permitir manutenção independente e carregamento de dados específico.

---

## 📊 2. Memorial de Cálculo e Origem dos Dados (Data Sourcing)

O sistema consome o arquivo `public/data.xlsx`. Abaixo, o mapeamento exato de onde cada "Pílula de Informação" é extraída.

### 🏬 APRESENTAÇÃO 1: DEPARTAMENTO COMERCIAL (ESTRATÉGICO)
**Planilha de Origem:** `ANALISES COMERCIAL`

| Indicador | Regra de Extração (Célula/Linha) | Memorial de Cálculo (Fórmula) |
| :--- | :--- | :--- |
| **Faturamento Total** | Busca no Excel a linha `__EMPTY` == "Total Geral" no bloco de Faturamento. | `Soma(Coluna FEVEREIRO)` de todos os vendedores. |
| **Positivações** | Localiza o cabeçalho "POSITIVADOS" e lê o "Total Geral" associado. | Valor absoluto de clientes únicos que compraram. |
| **Taxa de Conversão** | Busca "Conversão de positivação" na coluna `INDICADOR`. | `(Total Positivados / Total Novos Cadastros) * 100` |
| **Realizado vs. Previsto** | Compara a linha de "Faturamento" (Realizado) vs. Meta estabelecida. | `Variação % = ((Realizado - Previsto) / Previsto) * 100` |
| **Destaque Vendedor** | Varre a coluna `CRESCIMENTO` e seleciona o maior valor positivo. | `Max(Crescimento %)` |

---

### 👥 APRESENTAÇÃO 2: DEPTO COMERCIAL (OPERACIONAL/EQUIPES)
**Planilha de Origem:** `BASE DADOS COMERCIAL` e `BD dp`

| Indicador | Regra de Extração (Célula/Linha) | Memorial de Cálculo (Fórmula) |
| :--- | :--- | :--- |
| **Ticket Médio** | Planilha `BASE DADOS COMERCIAL`. | `Média(Coluna VALOR_TOTAL)` |
| **Vendas por Canal** | Agrupamento (Group By) pela coluna `DEPT` ou `DEPTO`. | `Soma(Valor) onde Depto == "TELEVENDAS"`, etc. |
| **Ranking Individual** | Ordenação decrescente da coluna `VALOR_REALIZADO`. | `Top 10 Vendedores` |
| **Pedidos Pendentes** | Contagem de linhas onde a coluna `STATUS` contém "Pendente". | `CountIf(Status, "Pendente")` |

---

### 💰 APRESENTAÇÃO 3: FINANCEIRO (GESTÃO E LIQUIDEZ)
**Planilha de Origem:** `ANALISES FIN.`

| Indicador | Regra de Extração (Aba Analítica) | Memorial de Cálculo (Fórmula) |
| :--- | :--- | :--- |
| **Total Recebido** | Linha: "Total de recebimentos dentro do mês (conciliados)". | Valor extraído da coluna `REALIZADO`. |
| **Inadimplência** | Linha: "Inadimplência / atrasos (R$ e qtde)". | Valor em R$ dos títulos vencidos não pagos. |
| **Lucro Operacional** | Linha: "Lucro antes pagamento dívidas, investimentos e sócio". | `Faturamento - Deduções - Custos Variáveis - FIXOS`. |
| **Margem de Contribuição**| Linha: "Margem de Contribuição". | `(Margem R$ / Faturamento Total) * 100` |
| **Fluxo Mensal** | Dados históricos das colunas `JANEIRO` e `FEVEREIRO`. | Comparativo temporal de entradas líquidas. |

---

## 🎨 3. Especificações de Design e Estética (Aesthetic Guidelines)

Para atingir o efeito **WOW** e o visual **PREMIUM** solicitado:

1.  **Paleta "Clear Mode":**
    *   Fundo da Aplicação: `#F0F2F5` (Cinza suave para profundidade).
    *   Cards de Dados: `#FFFFFF` (Branco puríssimo com bordas arredondadas de 16px).
    *   Sombras: `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)`.
2.  **Gradientes de Identidade (Gradientes Material):**
    *   **Dashboard Comercial:** Azul (`#49a3f1` para `#1A73E8`).
    *   **Dashboard Financeiro:** Verde (`#66BB6A` para `#43A047`).
    *   **Dashboard Operacional:** Laranja (`#FFA726` para `#FB8C00`).
3.  **Tipografia:**
    *   Números Principais: Fonte sans-serif, peso 700 (Bold).
    *   Legendas: Peso 300 com cor `#7b809a`.
4.  **Micro-animações:** Efeito de "hover" nos cards que sobem 4px ao passar o mouse e transição de opacidade ao trocar de aba.

---

## ⚙️ 4. Fluxo de Sincronização e Auditoria

O sistema possui um rastro de auditoria para garantir que o que está no Excel é o que está na tela:

*   **Sincronização:** Ao clicar em "Sincronizar DB", o sistema limpa o cache de `workbook` e faz um novo `fetch` do `/data.xlsx`.
*   **Tratamento de Erros:** Se uma aba esperada não for encontrada (ex: renomeada no Excel), o sistema automaticamente tenta filtrar os dados pela coluna `DEPTO` na base geral, evitando que o dashboard fique em branco.
*   **Notificação de Offline:** Caso o arquivo `data.xlsx` seja removido, o dashboard apresenta uma tela de "Upload Manual" para que o usuário não pare de trabalhar.
