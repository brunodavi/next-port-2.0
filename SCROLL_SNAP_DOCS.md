# Scroll Snap Portfolio - Documentação

## 🎯 Funcionalidade Implementada

Este projeto agora suporta **scroll snap em seções** baseadas nos headings do seu README do GitHub. Cada seção (h1-h6) é automaticamente agrupada com todo seu conteúdo e exibida em tela cheia com navegação suave.

## 🚀 Como Funciona

### 1. Parser de Markdown (`markdown-sections.ts`)
- Processa o markdown bruto usando `unified` e `remark-parse`
- Identifica todos os headings (h1-h6)
- Agrupa automaticamente todo o conteúdo entre headings
- Converte de volta para markdown para renderização

### 2. Componente ProfileMarkdown
- Busca o README do GitHub
- Processa em seções usando o parser
- Renderiza cada seção em um container de altura completa (`min-h-screen`)
- Aplica scroll snap para navegação automática

### 3. Indicadores de Seção
- Dots na lateral direita mostram a seção atual
- Clicáveis para navegação rápida
- Atualizam automaticamente baseado no scroll

## 📦 Dependências Adicionadas

```json
{
  "remark": "^15.0.0",
  "remark-parse": "^11.0.0",
  "remark-rehype": "^11.0.0",
  "rehype-stringify": "^10.0.0",
  "unified": "^11.0.0"
}
```

## 🎨 CSS Aplicado

### Scroll Snap
```css
.snap-y {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

section {
  scroll-snap-align: start;
  scroll-snap-stop: always;
}
```

### Estrutura das Seções
- Cada seção: `min-h-screen` (altura mínima 100vh)
- Conteúdo: centralizado vertical e horizontalmente
- Responsivo: ajustes de padding e tamanho de fonte

## ✨ Recursos

### ✅ O que funciona automaticamente:
- 📝 Lê qualquer README do GitHub
- 🔄 Agrupa conteúdo por seções (headings)
- 📱 Totalmente responsivo
- 🎯 Scroll snap suave e magnético
- 🔘 Indicadores de navegação lateral
- 🌓 Suporte a tema claro/escuro
- 🎨 Estilização automática de markdown (listas, códigos, links, etc.)

### 🎯 Você NÃO precisa:
- ❌ Modificar o README do GitHub
- ❌ Adicionar classes ou IDs especiais
- ❌ Estruturar o markdown de forma diferente
- ❌ Fazer configurações manuais

## 🔧 Customização

### Ajustar tamanho dos headings
Edite em `ProfleMarkdown.tsx`:
```tsx
const headingClasses: Record<number, string> = {
  1: "text-5xl md:text-6xl font-bold mb-8",
  2: "text-4xl md:text-5xl font-bold mb-6",
  // ... customize aqui
}
```

### Mudar comportamento do scroll
Em `page.tsx`:
```tsx
// snap-mandatory: sempre snap (atual)
// snap-proximity: snap apenas quando próximo
<div className="snap-y snap-mandatory">
```

### Desabilitar indicadores
Remova de `page.tsx`:
```tsx
<SectionIndicators totalSections={sections.length} />
```

## 🐛 Possíveis Problemas e Soluções

### Seções muito curtas
Se o conteúdo de uma seção for muito pequeno, ficará centralizado. Para preencher mais:
```tsx
// Em MarkdownSection, mude justify-center para justify-start
className="min-h-screen flex flex-col justify-start"
```

### Scroll não funciona em mobile
Certifique-se de que não há `overflow: hidden` conflitando no CSS global.

### Imagens quebrando layout
As imagens são automáticas responsivas com `max-w-full`. Se precisar de mais controle:
```tsx
img: (props: any) => <img className="max-w-md mx-auto" {...props} />
```

## 📊 Estrutura de Arquivos

```
app/
├── components/
│   ├── ProfleMarkdown.tsx      # Renderiza seções
│   ├── SectionIndicators.tsx   # Dots de navegação
│   └── ThemeToggle.tsx         # Toggle tema
├── lib/
│   ├── constants.ts            # URLs e constantes
│   └── markdown-sections.ts    # Parser de markdown
├── page.tsx                    # Página principal
└── globals.css                 # Estilos globais
```

## 🎓 Conceitos Utilizados

- **CSS Scroll Snap**: Navegação magnética entre seções
- **MDX Remote**: Renderização de markdown com componentes React
- **Unified/Remark**: Processamento e parsing de markdown
- **AST (Abstract Syntax Tree)**: Manipulação da estrutura do markdown
- **Server Components**: Busca de dados no servidor (Next.js 15)
- **Tailwind CSS**: Estilização utilitária e responsiva

## 🚀 Próximos Passos (Opcional)

- [ ] Adicionar animações de entrada com Framer Motion
- [ ] Implementar navegação por teclado (setas)
- [ ] Criar transições personalizadas entre seções
- [ ] Adicionar menu de navegação com títulos das seções
- [ ] Implementar indicador de progresso de leitura
- [ ] Otimizar renderização de imagens grandes

---

Feito com ❤️ usando Next.js 15 e Tailwind CSS
