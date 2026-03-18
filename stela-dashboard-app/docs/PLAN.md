# 🎼 Multi-Agent Orchestration: Stela Dashboard Audit & Pro Max Upgrade

**Objective:** Transform the Stela Dashboard into a premium, hyper-presented, and bug-free professional tool for Ferreira Distribuidora.

---

## 🏗️ Roles & Agents

| Agent | Domain | Responsibility |
|-------|--------|----------------|
| `project-planner` | **Coordination** | Progress tracking, Plan management, Synthesis of results. |
| `frontend-specialist`| **Visual & UI** | Implementing "UI/UX Pro Max" standards: typography, shadows, gradients, and layout. |
| `test-engineer` | **Reliability** | Functional testing of dashboards, data reading from Excel, and report generation. |
| `security-auditor` | **Security** | Final vulnerability scan and risk assessment of the kit integration. |

---

## 📋 Phase 1: Audit & Planning (CURRENT)

1. [x] **Discovery**: Initial codebase scan and file mapping.
2. [x] **UX Audit**: Run `.agent/skills/frontend-design/scripts/ux_audit.py` (Issues found: 20).
3. [ ] **Design System Generation**: Execute `ui-ux-pro-max` design-system script to establish "Source of Truth".
4. [ ] **Finalize Plan**: Secure USER approval for implementation steps.

---

## 🚀 Phase 2: Implementation (Pending Approval)

### 1. UI/UX Pro Max Upgrade (`frontend-specialist`)
- **Global Stylings**: Fix `globals.css` (labels for inputs, line-heights, contrast).
- **Glassmorphism**: Refine the Header and Sidebar for consistent "Glow & Glass" effect.
- **Charts**: Upgrade all ApexCharts with premium themes (Gradients, proper tooltips).
- **StatCards**: Add hover micro-animations and "Total Year" context for better readability.

### 2. Data Integrity (`test-engineer`)
- **Excel Reading**: Fix `dataUtils.js` to handle all possible sheet names and columns found in `inspect_excel_v2.cjs`.
- **Wide Form Support**: Ensure all dashboard components select the correct month column based on the global filter.
- **Fallbacks**: Improve "No Data" states and loading skeletons.

### 3. Verification & Report (`security-auditor` & `test-engineer`)
- **Audit Script**: Re-run `ux_audit.py` to target 0 issues.
- **Security Scan**: Run `security_scan.py` to ensure toolkit integrity.
- **Final Report**: Generate the "Orchestration Report" with synthesis.

---

## ⏸️ CHECKPOINT: User Approval Required

**Rodrigo, o plano acima está alinhado com o que você precisa?**
- **S:** Iniciar implementação em paralelo.
- **N:** Ajustar o plano.

> **Status da Kit:** `antigravity-kit` está instalado e rodando (Workflows, Skills e Scripts estão ativos).
