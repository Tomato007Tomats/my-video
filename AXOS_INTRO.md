# 🎬 Axos AI - Intro Motion Design

Uma intro minimalista e elegante para apresentar o Axos AI, desenvolvida com Remotion e o design system do projeto.

## 📋 Visão Geral

**Duração:** 15 segundos (450 frames @ 30fps)
**Resolução:** 1920x1080 (Full HD)
**Estilo:** Minimalista com glass morphism e gradientes animados
**Paleta:** Roxo elétrico (#7916ff) com fundo dark
**Design System:** 100% integrado com tokens e componentes do projeto

## 🎨 Estrutura da Animação

### Scene 1: Logo Reveal com Badge (0-3s)
- Badge "✨ Powered by AI" animado
- Aparição do logo "Axos AI" com efeito de spring suave
- Glow animado em roxo que se dissipa
- Linha decorativa com efeito de luz
- **Efeito:** Entrada premium e profissional

### Scene 2: Título Principal em Glass Card (2.5-6s)
- Card principal com glass morphism completo
- Título: "Inteligência que transforma sua estratégia"
- Subtítulo: "Análise de mercado, portfólio e insights em tempo real"
- Tags animadas: Real-time Analysis, AI-Powered, Smart Alerts, Portfolio Tracking
- Animação de slide vertical + fade + spring
- **Efeito:** Apresentação elegante da proposta de valor

### Scene 3: Features Grid Detalhado (5.5-11s)
- Título da seção: "Funcionalidades que fazem a diferença"
- Grid 2x2 com 4 funcionalidades principais:
  - 📊 Análise de Portfólio (Badge: Core Feature)
  - 🎯 Chat Inteligente (Badge: AI Powered)
  - 💹 Market Insights (Badge: Real-time)
  - ⚡ Alertas Smart (Badge: Automated)
- Cards aprimorados com:
  - Glass morphism com backdrop blur
  - Light effect no topo (design system)
  - Badges personalizados
  - Gradient decorativo no rodapé
  - Efeito de hover simulado
- Animação em cascata (stagger) mais elaborada
- **Efeito:** Showcase completo das funcionalidades

### Scene 4: Stats & Metrics (10.5-13s)
- Título: "Confiado por milhares de investidores"
- 3 métricas principais em cards glass:
  - 👥 10K+ Usuários Ativos
  - 💰 500M+ Em Volume
  - ⚡ 99.9% Uptime
- Animação de entrada com spring bouncy
- Ícones com efeito de glow
- **Efeito:** Prova social e confiabilidade

### Scene 5: Call to Action Final (12.5-15s)
- Container principal com glass morphism avançado
- Título: "Pronto para transformar seus investimentos?"
- Subtítulo: "Junte-se a milhares de investidores que já usam Axos AI"
- Botão CTA: "Experimente Gratuitamente"
  - Efeito de pulse contínuo
  - Glow pulsante
  - Sombras dinâmicas
- Badge com URL: axos.ai
- **Efeito:** CTA irresistível e profissional

## 🎯 Design Tokens Utilizados

Todos os elementos seguem o design system (`design-tokens.ts`):

- **Cores:** `COLORS.primary`, `COLORS.text`, `COLORS.glass`
- **Tipografia:** `TYPOGRAPHY.fonts.sans` (Inter)
- **Efeitos:** Glass morphism com backdrop blur
- **Animações:** Spring (damping: 200) e Easing curves

## 🚀 Como Usar

### Pré-visualizar
```bash
npm start
```

Selecione "AxosIntro" no player do Remotion.

### Renderizar
```bash
# MP4 Full HD
npx remotion render AxosIntro axos-intro.mp4

# Com qualidade alta
npx remotion render AxosIntro axos-intro.mp4 --codec=h264 --crf=15

# WebM (menor tamanho)
npx remotion render AxosIntro axos-intro.webm --codec=vp9
```

### Exportar como GIF
```bash
npx remotion render AxosIntro axos-intro.gif --image-format=png
```

## ⚙️ Configurações

A composição pode ser customizada em `src/Root.tsx`:

```tsx
<Composition
  id="AxosIntro"
  component={AxosIntro}
  durationInFrames={240}  // 8 segundos @ 30fps
  fps={30}                // Frame rate
  width={1920}            // Largura Full HD
  height={1080}           // Altura Full HD
/>
```

## 🎨 Personalização

### Alterar Duração das Cenas

Em `src/AxosIntro.tsx`, ajuste os valores de `from` e `durationInFrames`:

```tsx
<Sequence from={0} durationInFrames={2 * fps}>
  <LogoReveal />
</Sequence>
```

### Alterar Cores

Edite `design-system/design-tokens.ts` para mudar a paleta:

```ts
export const COLORS = {
  primary: {
    400: '#9f75ff',  // Roxo claro
    500: '#843dff',  // Roxo médio
    600: '#7916ff',  // Roxo escuro
  },
  // ...
}
```

### Alterar Textos

Modifique diretamente os componentes em `src/AxosIntro.tsx`:

```tsx
<h1>Axos AI</h1>  // Logo
<h2>Seu título aqui</h2>  // Título principal
```

## 📐 Boas Práticas Aplicadas

✅ **Animações baseadas em `useCurrentFrame()`** - Não usa CSS animations
✅ **Spring animations** com config suave (damping: 200)
✅ **Sequencing** com premount para performance
✅ **Easing curves** para movimentos naturais
✅ **Design tokens** para consistência visual
✅ **Glass morphism** com backdrop blur
✅ **Responsive text** com hierarquia clara

## 🎥 Especificações Técnicas

| Propriedade | Valor |
|-------------|-------|
| Duração | 8 segundos |
| FPS | 30 |
| Resolução | 1920x1080 |
| Aspect Ratio | 16:9 |
| Codec | H.264 / VP9 |
| Tamanho estimado | ~2-5 MB |

## 🔧 Troubleshooting

### Texto não aparece
- Verifique se as fontes estão carregadas em `index.css`
- Confirme que o design system foi importado corretamente

### Animação travada
- Aumente o `premountFor` nas Sequences
- Reduza a complexidade dos efeitos visuais

### Cores diferentes do esperado
- Confirme que está usando os tokens do design system
- Verifique se não há estilos CSS conflitantes

## 📝 Notas

- A intro foi otimizada para redes sociais e apresentações
- Todos os efeitos são renderizáveis (não dependem de CSS animations)
- O design é totalmente responsivo e pode ser ajustado para outras resoluções
- Seguindo best practices do Remotion para performance máxima

---

**Desenvolvido com:** Remotion + Design System Axos
**Estilo:** Minimalista, profissional, moderno
**Objetivo:** Apresentar Axos AI de forma impactante e memorável
