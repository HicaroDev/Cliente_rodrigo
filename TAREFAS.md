# Stela Dashboard — Plano de Trabalho

> **Projeto:** Dashboard BI Ferreira Distribuidora
> **Cliente:** Stela | **Dev:** Rodrigo
> **Objetivo:** Dashboard profissional com 3 abas de departamento, estilo Material Dashboard React

---

## Progresso Geral

| Fase | Status |
|------|--------|
| Análise dos dados (Excel) | ✅ Concluído |
| Planejamento de arquitetura | ✅ Concluído |
| Criação dos componentes base | ✅ Concluído |
| Dashboard Comercial (Estrat.)| ✅ Concluído |
| Dashboard Comercial (Oper.)  | ✅ Concluído |
| Dashboard Financeiro         | ✅ Concluído |
| Dashboard Pessoal (DP)       | ✅ Concluído |
| Filtro de Período (Mês)      | ✅ Concluído |
| Conexão com planilha Excel   | ✅ Funcional |
| Testes e ajustes finais      | ✅ Concluído |

---

## Estrutura dos Dados (Excel)

**Arquivo principal:** `MODELO BD DI ULTIMA ATUALIZACAO (2).xlsx`
**Arquivo a usar no app:** `stela-dashboard-app/public/data.xlsx`

### Colunas esperadas:
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `DATA` | Data | Data de referência do indicador |
| `DEPT` | Texto | Departamento: `Comercial`, `Finanças`, `Pessoal` / `DP` |
| `INDICADOR` | Texto | Nome do KPI (ex: "Faturamento Bruto") |
| `PREVISTO` | Número | Meta / Valor previsto |
| `REALIZADO` | Número | Valor efetivamente realizado |
| `GRÁFICO` | Texto | Tipo de gráfico sugerido (Coluna, Gauge, etc.) |

> **IMPORTANTE:** Para que a filtragem por departamento funcione, a coluna `DEPT` deve conter os valores corretos. Use as abas alternativas como fallback.

---

## Arquitetura do Projeto

```
stela-dashboard-app/src/
├── App.jsx                          ← Orquestrador principal (reescrito)
├── theme.js                         ← Paleta de cores centralizada
├── utils/
│   └── dataUtils.js                 ← Utilitários Excel + helpers
├── components/
│   ├── Sidebar.jsx                  ← Menu lateral
│   ├── Header.jsx                   ← Cabeçalho dinâmico
│   ├── StatCard.jsx                 ← Card de KPI (ícone flutuante)
│   ├── ChartCard.jsx                ← Card de gráfico (gradiente flutuante)
│   ├── DataTable.jsx                ← Tabela de indicadores
│   └── departments/
│       ├── ComercialDashboard.jsx   ← Aba Comercial
│       ├── FinanceiroDashboard.jsx  ← Aba Financeiro
│       └── PessoalDashboard.jsx     ← Aba Pessoal (DP)
└── public/
    └── data.xlsx                    ← Fonte de dados (substituir pela planilha real)
```

---

## Aba 1 — Departamento Comercial

**Cor tema:** Azul (`#49a3f1`)

### KPIs (4 cards):
| Card | Indicador | Formato |
|------|-----------|---------|
| 1 | Faturamento Total | R$ moeda |
| 2 | Positivações | Meta vs Realizado (qtd) |
| 3 | Conversão | % percentual |
| 4 | Destaque de Crescimento | Nome / valor |

### Gráficos:
- **Gráfico 1:** Barras — Previsto vs Realizado por indicador
- **Gráfico 2:** Linha — Crescimento de positivações

### Tabela:
- Todos os indicadores do dept Comercial
- Colunas: Indicador | Depto | Previsto | Realizado | Status

---

## Aba 2 — Departamento Financeiro

**Cor tema:** Verde (`#66BB6A`)

### KPIs (4 cards):
| Card | Indicador | Formato |
|------|-----------|---------|
| 1 | Faturamento Bruto | R$ moeda |
| 2 | Faturamento Líquido | R$ moeda |
| 3 | Lucro Bruto | R$ moeda |
| 4 | Margem Bruta | % (Meta vs Real) |

### Gráficos:
- **Gráfico 1:** Barras agrupadas — Indicadores financeiros
- **Gráfico 2:** Área — Tendência financeira

### Tabela:
- Todos os indicadores financeiros
- Valores percentuais formatados corretamente (ex: 0.34 → 34%)

---

## Aba 3 — Departamento Pessoal (DP)

**Cor tema:** Laranja (`#FFA726`)

### KPIs (4 cards):
| Card | Indicador | Formato |
|------|-----------|---------|
| 1 | Efetivo / Headcount | qtd pessoas |
| 2 | Turnover | % (Meta vs Real) |
| 3 | Admissões | qtd |
| 4 | Demissões | qtd |

### Gráficos:
- **Gráfico 1:** Barras — Movimentação de pessoal
- **Gráfico 2:** Barras — % atingimento por indicador

### Tabela:
- Todos os indicadores de RH/DP

---

## Instruções para Atualizar os Dados

### Opção A — Substituir o arquivo (recomendado)
1. Exporte sua planilha final como `.xlsx`
2. Renomeie para `data.xlsx`
3. Copie para `stela-dashboard-app/public/data.xlsx`
4. Rode o projeto: `npm run dev`

### Opção B — Upload manual no app
1. Acesse o dashboard
2. Clique em "Selecionar Planilha"
3. Escolha o arquivo `.xlsx`
4. O dashboard carrega automaticamente

### Estrutura obrigatória da planilha:
```
| DATA       | DEPT      | INDICADOR              | PREVISTO | REALIZADO | GRÁFICO  |
|------------|-----------|------------------------|----------|-----------|----------|
| 18/02/2026 | Comercial | Faturamento            | 500000   | 420000    | Coluna   |
| 18/02/2026 | Finanças  | Faturamento Bruto      | 500000   | 250000    | Coluna   |
| 18/02/2026 | Pessoal   | Headcount              | 45       | 43        | Coluna   |
```

---

## Como Rodar o Projeto

```bash
cd stela-dashboard-app
npm install
npm run dev
# Acesse: http://localhost:5000
```

---

## Pendências / Decisões Necessárias

- [ ] **Confirmar valores exatos da planilha de Pessoal (DP)** — quais indicadores existem?
- [ ] **Confirmar nome da coluna de departamento** — é `DEPT` ou `DEPTO` ou outro?
- [ ] **Logo da empresa** — usar "F" ou colocar imagem real?
- [ ] **Filtro de período** — implementar filtro por DATA no futuro?
- [ ] **Múltiplos meses** — planilha terá dados de vários meses?

---

## Histórico de Alterações

| Data | Alteração |
|------|-----------|
| 2026-03-17 | Análise inicial da estrutura de dados |
| 2026-03-17 | Refatoração completa — 3 abas departamentais |
| 2026-03-17 | Componentes extraídos (Sidebar, StatCard, ChartCard, DataTable) |
