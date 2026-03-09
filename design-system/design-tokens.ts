/**
 * Sistema de Design - Frapto.AI
 * ================================
 * Tokens de design centralizados para todo o projeto
 * Baseado no glass morphism e paleta roxa consistente
 */

// ============================================
// PALETA DE CORES
// ============================================

export const COLORS = {
  // Cores principais
  primary: {
    50: '#f3f1ff',
    100: '#ebe5ff',
    200: '#d9ceff',
    300: '#bea6ff',
    400: '#9f75ff',
    500: '#843dff',
    600: '#7916ff',
    700: '#6b04fd',
    800: '#5a03d4',
    900: '#4c05ad',
    950: '#2e0276',
  },

  // Purple brand específico
  purple: {
    light: '#a855f7',
    DEFAULT: '#8b5cf6',
    dark: '#7c3aed',
    darker: '#6d28d9',
  },

  // Glass morphism
  glass: {
    bg: 'rgba(255, 255, 255, 0.03)',
    bgHover: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.12)',
    blur: 'backdrop-blur-md',
    blurStrong: 'backdrop-blur-xl',
  },

  // Estados
  states: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },

  // Texto
  text: {
    primary: '#ffffff',
    secondary: 'rgba(255, 255, 255, 0.80)',
    muted: 'rgba(255, 255, 255, 0.60)',
    subtle: 'rgba(255, 255, 255, 0.50)',
    disabled: 'rgba(255, 255, 255, 0.30)',
  }
} as const;

// ============================================
// EFEITOS E SOMBRAS
// ============================================

export const EFFECTS = {
  // Sombras glass morphism
  shadow: {
    sm: '0_4px_16px_0_rgba(0,0,0,0.25)',
    md: '0_8px_32px_0_rgba(0,0,0,0.37)',
    lg: '0_12px_48px_0_rgba(0,0,0,0.45)',
    xl: '0_20px_64px_0_rgba(0,0,0,0.55)',
  },

  // Glows
  glow: {
    purple: '0_0_20px_rgba(168,85,247,0.15)',
    purpleStrong: '0_0_32px_rgba(168,85,247,0.25)',
    success: '0_0_20px_rgba(16,185,129,0.15)',
    error: '0_0_20px_rgba(239,68,68,0.15)',
  },

  // Efeito de luz no topo
  lightEffect: 'absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent',

  // Inset effects
  inset: {
    subtle: 'inset_0_2px_4px_rgba(0,0,0,0.06)',
    strong: 'inset_0_4px_8px_rgba(0,0,0,0.12)',
  }
} as const;

// ============================================
// ESPAÇAMENTOS E TAMANHOS
// ============================================

export const SPACING = {
  container: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
  gap: {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  },
  margin: {
    xs: 'm-2',
    sm: 'm-3',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
  }
} as const;

// ============================================
// ANIMAÇÕES E TRANSIÇÕES
// ============================================

export const ANIMATIONS = {
  transition: {
    fast: 'transition-all duration-200',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
  },
  hover: {
    scale: 'hover:scale-105',
    scaleSubtle: 'hover:scale-102',
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
  },
  loading: {
    spin: 'animate-spin',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce',
  }
} as const;

// ============================================
// TIPOGRAFIA
// ============================================

export const TYPOGRAPHY = {
  fonts: {
    sans: "font-['Inter']",
    display: "font-['Space_Grotesk']",
    mono: "font-['JetBrains_Mono']",
  },
  text: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  },
  weight: {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }
} as const;

// ============================================
// RESPONSIVIDADE
// ============================================

export const RESPONSIVE = {
  breakpoints: {
    sm: 'sm:',
    md: 'md:',
    lg: 'lg:',
    xl: 'xl:',
    '2xl': '2xl:',
  },
  grid: {
    auto: 'grid-cols-auto',
    '1': 'grid-cols-1',
    '2': 'grid-cols-2',
    '3': 'grid-cols-3',
    '4': 'grid-cols-4',
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }
} as const;

// ============================================
// COMPONENTE BASE CLASSES
// ============================================

export const BASE_CLASSES = {
  container: `${COLORS.glass.bg} ${COLORS.glass.blur} border border-white/[0.08] rounded-3xl shadow-[${EFFECTS.shadow.md}] relative overflow-hidden ${ANIMATIONS.transition.normal}`,
  card: `${COLORS.glass.bg} ${COLORS.glass.blur} border border-white/[0.08] rounded-2xl shadow-[${EFFECTS.shadow.md}] ${ANIMATIONS.transition.normal}`,
  buttonPrimary: `bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-300 flex items-center gap-2`,
  buttonSecondary: `${COLORS.glass.bg} hover:${COLORS.glass.bgHover} border border-white/[0.08] hover:border-white/[0.12] text-white/70 hover:text-white rounded-xl ${ANIMATIONS.transition.normal}`,
  inputGlass: `${COLORS.glass.bg} border border-white/[0.08] hover:border-white/[0.12] text-white rounded-xl focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 ${ANIMATIONS.transition.normal} placeholder:text-white/50`,
  tabTrigger: `group relative flex items-center gap-2 py-2.5 px-4 text-sm font-medium ${ANIMATIONS.transition.normal} rounded-xl data-[state=active]:text-white data-[state=active]:font-medium data-[state=active]:${COLORS.glass.bgHover} data-[state=active]:shadow-[${EFFECTS.glow.purple}] hover:text-gray-200 text-gray-400`,
} as const;

// ============================================
// DESIGN TOKENS POR MÓDULO
// ============================================

export const PORTFOLIO_DESIGN = {
  colors: {
    glass: COLORS.glass.bg,
    glassHover: COLORS.glass.bgHover,
    border: 'border-white/[0.08]',
    borderHover: 'hover:border-white/[0.12]',
    accent: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    positive: 'text-green-400',
    negative: 'text-red-400',
  },
  effects: {
    shadow: `shadow-[${EFFECTS.shadow.md}]`,
    glow: `shadow-[${EFFECTS.glow.purple}]`,
    lightEffect: EFFECTS.lightEffect,
  },
  transitions: ANIMATIONS.transition.normal,
} as const;

export const MARKET_DESIGN = {
  colors: {
    glass: COLORS.glass.bg,
    glassHover: COLORS.glass.bgHover,
    border: 'border-white/[0.08]',
    borderHover: 'hover:border-white/[0.12]',
    accent: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
  effects: {
    shadow: `shadow-[${EFFECTS.shadow.md}]`,
    glow: `shadow-[${EFFECTS.glow.purple}]`,
    lightEffect: EFFECTS.lightEffect,
  },
  transitions: ANIMATIONS.transition.normal,
} as const;

export const CHAT_DESIGN = {
  colors: {
    glass: COLORS.glass.bg,
    glassHover: COLORS.glass.bgHover,
    border: 'border-white/[0.08]',
    borderHover: 'hover:border-white/[0.12]',
    accent: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
  effects: {
    shadow: `shadow-[${EFFECTS.shadow.md}]`,
    glow: `shadow-[${EFFECTS.glow.purple}]`,
    lightEffect: EFFECTS.lightEffect,
  },
  transitions: ANIMATIONS.transition.normal,
} as const;

export const SETTINGS_DESIGN = {
  colors: {
    glass: COLORS.glass.bg,
    glassHover: COLORS.glass.bgHover,
    border: 'border-white/[0.08]',
    borderHover: 'hover:border-white/[0.12]',
    accent: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
  effects: {
    shadow: `shadow-[${EFFECTS.shadow.md}]`,
    glow: `shadow-[${EFFECTS.glow.purple}]`,
    lightEffect: EFFECTS.lightEffect,
  },
  transitions: ANIMATIONS.transition.normal,
} as const;

export const COIN_DESIGN = {
  colors: {
    glass: `${COLORS.glass.bg} ${COLORS.glass.blur} border-white/[0.08]`,
    glassHover: `hover:${COLORS.glass.bgHover} hover:border-white/[0.12]`,
    accent: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    positive: COLORS.text.primary,
    negative: 'text-red-400',
    muted: COLORS.text.muted,
    subtle: COLORS.text.subtle,
  },
  effects: {
    shadow: `shadow-[${EFFECTS.shadow.md}]`,
    glow: `shadow-[${EFFECTS.glow.purple}]`,
    lightEffect: EFFECTS.lightEffect,
  },
  transitions: ANIMATIONS.transition.normal,
} as const;

// ============================================
// CLASSES HELPER
// ============================================

export const PORTFOLIO_CLASSES = {
  container: `${PORTFOLIO_DESIGN.colors.glass} backdrop-blur-md ${PORTFOLIO_DESIGN.colors.border} rounded-3xl ${PORTFOLIO_DESIGN.effects.shadow} relative overflow-hidden ${PORTFOLIO_DESIGN.transitions}`,
  card: `${PORTFOLIO_DESIGN.colors.glass} backdrop-blur-md ${PORTFOLIO_DESIGN.colors.border} rounded-2xl ${PORTFOLIO_DESIGN.effects.shadow} ${PORTFOLIO_DESIGN.transitions}`,
  button: `${PORTFOLIO_DESIGN.colors.glass} ${PORTFOLIO_DESIGN.colors.borderHover} text-white/70 hover:text-white rounded-xl ${PORTFOLIO_DESIGN.transitions}`,
};

export const MARKET_CLASSES = {
  container: `${MARKET_DESIGN.colors.glass} backdrop-blur-md ${MARKET_DESIGN.colors.border} rounded-3xl ${MARKET_DESIGN.effects.shadow} relative overflow-hidden ${MARKET_DESIGN.transitions}`,
  card: `${MARKET_DESIGN.colors.glass} backdrop-blur-md ${MARKET_DESIGN.colors.border} rounded-2xl ${MARKET_DESIGN.effects.shadow} ${MARKET_DESIGN.transitions}`,
  button: `${MARKET_DESIGN.colors.glass} ${MARKET_DESIGN.colors.borderHover} text-white/70 hover:text-white rounded-xl ${MARKET_DESIGN.transitions}`,
};

export const CHAT_CLASSES = {
  container: `${CHAT_DESIGN.colors.glass} backdrop-blur-md ${CHAT_DESIGN.colors.border} rounded-3xl ${CHAT_DESIGN.effects.shadow} relative overflow-hidden ${CHAT_DESIGN.transitions}`,
  card: `${CHAT_DESIGN.colors.glass} backdrop-blur-md ${CHAT_DESIGN.colors.border} rounded-2xl ${CHAT_DESIGN.effects.shadow} ${CHAT_DESIGN.transitions}`,
  button: `${CHAT_DESIGN.colors.glass} ${CHAT_DESIGN.colors.borderHover} text-white/70 hover:text-white rounded-xl ${CHAT_DESIGN.transitions}`,
};

export const SETTINGS_CLASSES = {
  container: `${SETTINGS_DESIGN.colors.glass} backdrop-blur-md ${SETTINGS_DESIGN.colors.border} rounded-3xl ${SETTINGS_DESIGN.effects.shadow} relative overflow-hidden ${SETTINGS_DESIGN.transitions}`,
  card: `${SETTINGS_DESIGN.colors.glass} backdrop-blur-md ${SETTINGS_DESIGN.colors.border} rounded-2xl ${SETTINGS_DESIGN.effects.shadow} ${SETTINGS_DESIGN.transitions}`,
  button: `${SETTINGS_DESIGN.colors.glass} ${SETTINGS_DESIGN.colors.borderHover} text-white/70 hover:text-white rounded-xl ${SETTINGS_DESIGN.transitions}`,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Combina classes CSS de forma segura
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Aplica tema glass morphism a um elemento
 */
export function applyGlassMorphism(options: {
  intensity?: 'light' | 'normal' | 'strong';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
} = {}) {
  const { intensity = 'normal', rounded = 'md', shadow = 'md' } = options;

  const intensityClasses = {
    light: `${COLORS.glass.bg} ${COLORS.glass.blur}`,
    normal: `${COLORS.glass.bg} ${COLORS.glass.blur}`,
    strong: `${COLORS.glass.bgHover} ${COLORS.glass.blurStrong}`,
  };

  const roundedClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
  };

  return cn(
    intensityClasses[intensity],
    `border border-white/[0.08]`,
    `shadow-[${EFFECTS.shadow[shadow]}]`,
    roundedClasses[rounded],
    ANIMATIONS.transition.normal
  );
}

/**
 * Gera classes para botão com variantes
 */
export function createButtonClasses(variant: 'primary' | 'secondary' | 'ghost' = 'primary') {
  const variants = {
    primary: BASE_CLASSES.buttonPrimary,
    secondary: BASE_CLASSES.buttonSecondary,
    ghost: `text-white/70 hover:text-white hover:${COLORS.glass.bgHover} rounded-xl ${ANIMATIONS.transition.normal}`,
  };

  return variants[variant];
}

export default {
  COLORS,
  EFFECTS,
  SPACING,
  ANIMATIONS,
  TYPOGRAPHY,
  RESPONSIVE,
  BASE_CLASSES,
  PORTFOLIO_DESIGN,
  MARKET_DESIGN,
  CHAT_DESIGN,
  SETTINGS_DESIGN,
  COIN_DESIGN,
  PORTFOLIO_CLASSES,
  MARKET_CLASSES,
  CHAT_CLASSES,
  SETTINGS_CLASSES,
  cn,
  applyGlassMorphism,
  createButtonClasses,
};
