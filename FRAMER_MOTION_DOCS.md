# Animações com Framer Motion - Documentação

## 🎬 Animações Implementadas

### 1. **AnimatedSection** (`components/AnimatedSection.tsx`)
Wrapper para seções com animação de entrada suave.

**Efeitos:**
- ✅ Fade in (opacidade 0 → 1)
- ✅ Slide up (Y: 50px → 0)
- ✅ Trigger baseado em viewport (IntersectionObserver)
- ✅ Anima apenas uma vez (`once: true`)

**Configuração:**
```typescript
initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
transition={{
  duration: 0.8,
  ease: [0.25, 0.46, 0.45, 0.94] // Cubic bezier suave
}
```

**Uso:**
```tsx
<AnimatedSection index={0} sectionId="section-0">
  {/* Conteúdo da seção */}
</AnimatedSection>
```

---

### 2. **AnimatedHeading** (`components/AnimatedContent.tsx`)
Animação específica para títulos das seções.

**Efeitos:**
- ✅ Fade in
- ✅ Slide down (Y: -20px → 0)
- ✅ Aparece antes do conteúdo

**Configuração:**
```typescript
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7 }}
```

**Timing:**
- Delay: 0s (aparece primeiro)
- Duração: 0.7s

---

### 3. **AnimatedContent** (`components/AnimatedContent.tsx`)
Container com stagger effect para parágrafos e listas.

**Efeitos:**
- ✅ Fade in sequencial
- ✅ Slide up (Y: 20px → 0)
- ✅ Stagger entre elementos (0.15s)

**Configuração:**
```typescript
containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay entre filhos
      delayChildren: 0.2     // Delay inicial
    }
  }
}

itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
```

**Resultado:**
- Heading aparece
- Aguarda 0.2s
- Parágrafo 1 aparece
- Aguarda 0.15s
- Parágrafo 2 aparece
- E assim por diante...

---

### 4. **SectionIndicators** (`components/SectionIndicators.tsx`)
Animação dos dots de navegação lateral.

**Efeitos:**
- ✅ Container: Slide da direita (X: 20px → 0)
- ✅ Dots: Scale animation (0 → 1) com stagger
- ✅ Hover: Scale 1.3x
- ✅ Tap: Scale 0.9x

**Configuração:**
```typescript
// Container
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.6, delay: 0.5 }}

// Cada dot
initial={{ opacity: 0, scale: 0 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ 
  duration: 0.3, 
  delay: 0.6 + (index * 0.05) // Stagger de 50ms
}

// Interações
whileHover={{ scale: 1.3 }}
whileTap={{ scale: 0.9 }}
```

**Timeline:**
1. 0.5s - Container aparece
2. 0.6s - Primeiro dot
3. 0.65s - Segundo dot
4. 0.7s - Terceiro dot
5. ...

---

### 5. **ThemeToggle** (`components/ThemeToggle.tsx`)
Animação do seletor de tema.

**Efeitos:**
- ✅ Container: Slide de cima (Y: -20px → 0)
- ✅ Botões: Scale animation com stagger
- ✅ Hover: Scale 1.05x
- ✅ Tap: Scale 0.95x

**Configuração:**
```typescript
// Container
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: 0.3 }}

// Cada botão
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ 
  duration: 0.3, 
  delay: 0.4 + (index * 0.1) // Stagger de 100ms
}

// Interações
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

---

## 🎯 Timeline Completa de Carregamento

```
0.0s  │ Skeleton aparece
      │
3.0s  │ Conteúdo carregado (delay artificial)
      │
3.0s  │ ┌─ ThemeToggle começa
3.3s  │ └─ ThemeToggle completo
      │
3.5s  │ ┌─ SectionIndicators começa
3.8s  │ └─ SectionIndicators completo (com stagger)
      │
3.0s  │ ┌─ Primeira seção começa
3.1s  │ │  ├─ Section container fade in
3.1s  │ │  ├─ Heading aparece
3.3s  │ │  ├─ Conteúdo começa (delay 0.2s)
3.45s │ │  ├─ Primeiro parágrafo
3.6s  │ │  ├─ Segundo parágrafo
3.75s │ │  └─ Lista
3.8s  │ └─ Primeira seção completa
      │
Scroll│ Nova seção entra no viewport
      │ └─ Repete animação
```

---

## ⚙️ Otimizações de Performance

### 1. **useInView Hook**
```typescript
const isInView = useInView(ref, { 
  once: true,        // Anima apenas uma vez
  margin: "-100px"   // Trigger 100px antes
});
```

**Benefícios:**
- ✅ Não re-renderiza desnecessariamente
- ✅ Animação suave sem lag
- ✅ Economiza recursos

### 2. **Ease Curve Personalizada**
```typescript
ease: [0.25, 0.46, 0.45, 0.94]
```

**Por quê?**
- Curva cubic-bezier otimizada
- Movimento natural e fluido
- Inspirada em material design

### 3. **Stagger Effect**
```typescript
staggerChildren: 0.15
```

**Balanceamento:**
- ⚡ Rápido: 0.05s - 0.1s (pode parecer abrupto)
- ✅ Ideal: 0.15s - 0.2s (suave e perceptível)
- 🐌 Lento: 0.3s+ (pode parecer travado)

---

## 🎨 Customização

### Ajustar Velocidade Global
```typescript
// Mais rápido
transition={{ duration: 0.4 }}

// Mais lento
transition={{ duration: 1.2 }}
```

### Mudar Direção do Slide
```typescript
// Slide da esquerda
initial={{ opacity: 0, x: -50 }}

// Slide da direita
initial={{ opacity: 0, x: 50 }}

// Slide de cima
initial={{ opacity: 0, y: -50 }}

// Slide de baixo
initial={{ opacity: 0, y: 50 }}
```

### Desabilitar Animações em Seção Específica
```tsx
// Em ProfileMarkdown.tsx
{index === 0 ? (
  <section>{/* Sem animação */}</section>
) : (
  <AnimatedSection>{/* Com animação */}</AnimatedSection>
)}
```

### Adicionar Delay
```typescript
transition={{ 
  duration: 0.8,
  delay: 0.5  // Aguarda 500ms antes de animar
}}
```

---

## 📊 Comparação: Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Entrada de seções | Instantânea | Fade + Slide (0.8s) |
| Headings | Aparece junto | Slide down (0.7s) |
| Conteúdo | Tudo de uma vez | Stagger (0.15s) |
| Indicadores | Aparecem juntos | Stagger (0.05s) |
| ThemeToggle | Instantâneo | Slide down (0.5s) |
| Interatividade | Apenas hover | Hover + Tap animations |
| Sensação | Estático | Dinâmico e vivo |

---

## 🚀 Próximas Melhorias (Opcional)

- [ ] Adicionar animação de saída ao sair do viewport
- [ ] Parallax effect no background
- [ ] Animações diferentes para cada tipo de seção (h1, h2, etc)
- [ ] Gesture-based navigation (swipe)
- [ ] Animação de transição entre temas
- [ ] Efeito de "magnetic scroll" mais pronunciado
- [ ] Animações específicas para imagens
- [ ] Loading progressivo de seções

---

## 🐛 Troubleshooting

### Animações não aparecem
- Verifique se `framer-motion` está instalado
- Certifique-se que componentes têm `'use client'`
- Confira se `useInView` está importado corretamente

### Animações muito rápidas/lentas
- Ajuste `duration` nas transitions
- Modifique `staggerChildren` delay

### Performance ruim
- Reduza número de elementos animados
- Use `once: true` no `useInView`
- Simplifique curvas de ease

---

**Resultado:** Portfolio com animações profissionais e fluidas! ✨
