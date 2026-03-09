import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, Easing } from 'remotion';
import { COLORS, EFFECTS, TYPOGRAPHY, SPACING, BASE_CLASSES, applyGlassMorphism } from '../design-system/design-tokens';

/**
 * Axos AI Intro - Motion Design Minimalista
 * Apresenta as funcionalidades do Axos AI com animações suaves
 * Duração: 15 segundos
 */
export const AxosIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background gradient animation - mais lento e suave
  const gradientRotation = interpolate(
    frame,
    [0, 15 * fps],
    [0, 360],
    {
      extrapolateRight: 'clamp',
    }
  );

  // Segundo gradiente para profundidade
  const gradient2Rotation = interpolate(
    frame,
    [0, 15 * fps],
    [360, 0],
    {
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        fontFamily: TYPOGRAPHY.fonts.sans.replace("font-['", '').replace("']", ''),
      }}
    >
      {/* Animated Background Gradients - Múltiplas camadas */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: `translateX(-50%) rotate(${gradientRotation}deg)`,
          width: '1600px',
          height: '1600px',
          background: `radial-gradient(circle, ${COLORS.primary[400]}20 0%, transparent 60%)`,
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          right: '-10%',
          transform: `rotate(${gradient2Rotation}deg)`,
          width: '1200px',
          height: '1200px',
          background: `radial-gradient(circle, ${COLORS.primary[600]}15 0%, transparent 70%)`,
          opacity: 0.4,
        }}
      />

      {/* Scene 1: Logo Reveal com Badge (0-3s) */}
      <Sequence from={0} durationInFrames={3 * fps} premountFor={fps}>
        <LogoReveal />
      </Sequence>

      {/* Scene 2: Título Principal (2.5-6s) */}
      <Sequence from={2.5 * fps} durationInFrames={3.5 * fps} premountFor={fps}>
        <MainTitle />
      </Sequence>

      {/* Scene 3: Features Grid Detalhado (5.5-11s) */}
      <Sequence from={5.5 * fps} durationInFrames={5.5 * fps} premountFor={fps}>
        <FeaturesGrid />
      </Sequence>

      {/* Scene 4: Stats & Metrics (10.5-13s) */}
      <Sequence from={10.5 * fps} durationInFrames={2.5 * fps} premountFor={fps}>
        <StatsScene />
      </Sequence>

      {/* Scene 5: Call to Action (12.5-15s) */}
      <Sequence from={12.5 * fps} durationInFrames={2.5 * fps} premountFor={fps}>
        <CallToAction />
      </Sequence>
    </AbsoluteFill>
  );
};

/**
 * Scene 1: Logo Reveal com Badge
 * Animação de entrada do logo com efeito de glow e badge do design system
 */
const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(
    frame,
    [0, 0.5 * fps],
    [0, 1],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );

  const glowIntensity = interpolate(
    frame,
    [0.5 * fps, 2 * fps],
    [0.4, 0],
    {
      extrapolateRight: 'clamp',
    }
  );

  // Badge animation
  const badgeOpacity = interpolate(
    frame,
    [1 * fps, 1.8 * fps],
    [0, 1],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );

  const badgeY = interpolate(
    frame,
    [1 * fps, 2 * fps],
    [20, 0],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        opacity,
      }}
    >
      {/* Badge superior - usando design do sistema */}
      <div
        style={{
          opacity: badgeOpacity,
          transform: `translateY(${badgeY}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: `${COLORS.primary[500]}15`,
            borderRadius: '12px',
            border: `1px solid ${COLORS.primary[500]}30`,
          }}
        >
          <span
            style={{
              color: COLORS.primary[400],
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            ✨ Powered by AI
          </span>
        </div>
      </div>

      {/* Logo principal */}
      <div
        style={{
          transform: `scale(${scale})`,
          filter: `drop-shadow(0 0 ${50 * glowIntensity}px ${COLORS.primary[500]})`,
        }}
      >
        <h1
          style={{
            fontSize: '140px',
            fontWeight: 700,
            background: `linear-gradient(135deg, ${COLORS.primary[300]}, ${COLORS.primary[600]}, ${COLORS.primary[700]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            letterSpacing: '-0.03em',
          }}
        >
          Axos AI
        </h1>
      </div>

      {/* Linha decorativa com glow */}
      <div
        style={{
          width: '300px',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${COLORS.primary[500]}, transparent)`,
          opacity: badgeOpacity,
          boxShadow: `0 0 20px ${COLORS.primary[500]}`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Scene 2: Main Title com Glass Card
 * Título com subtítulo animado em card com glass morphism
 */
const MainTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(
    frame,
    [0, 0.5 * fps],
    [0, 1],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );

  const titleY = interpolate(
    frame,
    [0, 1 * fps],
    [40, 0],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.exp),
    }
  );

  const subtitleOpacity = interpolate(
    frame,
    [0.5 * fps, 1.3 * fps],
    [0, 1],
    {
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    }
  );

  const cardScale = spring({
    frame: frame - 0.2 * fps,
    fps,
    config: { damping: 200 },
  });

  // Features tags animation
  const tagsOpacity = interpolate(
    frame,
    [1.5 * fps, 2.2 * fps],
    [0, 1],
    {
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px',
        padding: '0 80px',
      }}
    >
      {/* Card principal com glass morphism */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px) scale(${cardScale})`,
          backgroundColor: COLORS.glass.bg,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${COLORS.glass.border}`,
          borderRadius: '32px',
          padding: '64px 80px',
          maxWidth: '1200px',
          boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px ${COLORS.primary[500]}20`,
        }}
      >
        <h2
          style={{
            fontSize: '72px',
            fontWeight: 600,
            color: COLORS.text.primary,
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '24px',
          }}
        >
          Inteligência que transforma
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary[300]}, ${COLORS.primary[500]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            sua estratégia
          </span>
        </h2>

        <div style={{ opacity: subtitleOpacity }}>
          <p
            style={{
              fontSize: '28px',
              color: COLORS.text.secondary,
              margin: 0,
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            Análise de mercado, portfólio e insights em tempo real
          </p>
        </div>
      </div>

      {/* Tags de features */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          opacity: tagsOpacity,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '900px',
        }}
      >
        {['Real-time Analysis', 'AI-Powered', 'Smart Alerts', 'Portfolio Tracking'].map((tag, i) => (
          <div
            key={tag}
            style={{
              padding: '12px 24px',
              backgroundColor: `${COLORS.primary[500]}10`,
              border: `1px solid ${COLORS.primary[500]}30`,
              borderRadius: '12px',
              fontSize: '16px',
              color: COLORS.primary[300],
              fontWeight: 500,
              transform: `translateY(${interpolate(frame, [1.5 * fps + i * 0.1 * fps, 2.2 * fps + i * 0.1 * fps], [20, 0], { extrapolateRight: 'clamp' })}px)`,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Scene 3: Features Grid
 * Grid animado com as principais funcionalidades
 */
const FeaturesGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const features = [
    {
      icon: '📊',
      title: 'Análise de Portfólio',
      description: 'Acompanhe seus investimentos em tempo real com métricas avançadas',
      badge: 'Core Feature',
    },
    {
      icon: '🎯',
      title: 'Chat Inteligente',
      description: 'IA conversacional que responde dúvidas sobre criptomoedas',
      badge: 'AI Powered',
    },
    {
      icon: '💹',
      title: 'Market Insights',
      description: 'Tendências, análises e oportunidades do mercado cripto',
      badge: 'Real-time',
    },
    {
      icon: '⚡',
      title: 'Alertas Smart',
      description: 'Notificações inteligentes e personalizadas para suas estratégias',
      badge: 'Automated',
    },
  ];

  // Título da seção
  const titleOpacity = interpolate(
    frame,
    [0, 0.5 * fps],
    [0, 1],
    {
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 100px',
        gap: '64px',
      }}
    >
      {/* Título da seção */}
      <div style={{ opacity: titleOpacity }}>
        <h2
          style={{
            fontSize: '48px',
            fontWeight: 600,
            color: COLORS.text.primary,
            margin: 0,
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          Funcionalidades que{' '}
          <span style={{ color: COLORS.primary[400] }}>fazem a diferença</span>
        </h2>
        <p
          style={{
            fontSize: '20px',
            color: COLORS.text.muted,
            margin: 0,
            textAlign: 'center',
          }}
        >
          Tudo que você precisa em uma única plataforma
        </p>
      </div>

      {/* Grid de features */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '48px',
          maxWidth: '1400px',
          width: '100%',
        }}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            badge={feature.badge}
            delay={(0.5 + index * 0.2) * fps}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Feature Card Component - Design System Enhanced
 */
const FeatureCard: React.FC<{
  icon: string;
  title: string;
  description: string;
  delay: number;
  badge?: string;
}> = ({ icon, title, description, delay, badge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - delay);

  const scale = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 200 },
  });

  const opacity = interpolate(
    adjustedFrame,
    [0, 0.4 * fps],
    [0, 1],
    {
      extrapolateRight: 'clamp',
    }
  );

  // Hover effect simulation
  const hoverEffect = interpolate(
    adjustedFrame,
    [0.5 * fps, 1.5 * fps, 2.5 * fps],
    [0, 1, 0],
    {
      extrapolateRight: 'clamp',
    }
  );

  return (
    <div
      style={{
        backgroundColor: COLORS.glass.bg,
        backdropFilter: 'blur(24px)',
        border: `1px solid ${COLORS.glass.border}`,
        borderRadius: '28px',
        padding: '40px',
        transform: `scale(${scale})`,
        opacity,
        boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${COLORS.primary[500]}${Math.round(hoverEffect * 40).toString(16).padStart(2, '0')}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top light effect from design system */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${COLORS.primary[400]}60, transparent)`,
        }}
      />

      {/* Badge opcional */}
      {badge && (
        <div
          style={{
            display: 'inline-flex',
            padding: '6px 12px',
            backgroundColor: `${COLORS.primary[500]}15`,
            border: `1px solid ${COLORS.primary[500]}30`,
            borderRadius: '8px',
            fontSize: '11px',
            color: COLORS.primary[300],
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '20px',
          }}
        >
          {badge}
        </div>
      )}

      <div
        style={{
          fontSize: '56px',
          marginBottom: '20px',
          filter: `drop-shadow(0 4px 12px ${COLORS.primary[500]}40)`,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: '28px',
          fontWeight: 600,
          color: COLORS.text.primary,
          margin: '0 0 16px 0',
          lineHeight: 1.2,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '18px',
          color: COLORS.text.secondary,
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      {/* Decorative gradient at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${COLORS.primary[600]}, ${COLORS.primary[400]})`,
          opacity: 0.3 + hoverEffect * 0.4,
        }}
      />
    </div>
  );
};

/**
 * Scene 4: Stats & Metrics
 * Mostra estatísticas com animação de contador
 */
const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const stats = [
    { value: '10K+', label: 'Usuários Ativos', icon: '👥' },
    { value: '500M+', label: 'Em Volume', icon: '💰' },
    { value: '99.9%', label: 'Uptime', icon: '⚡' },
  ];

  const containerOpacity = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '64px',
        opacity: containerOpacity,
      }}
    >
      {/* Título */}
      <div>
        <h2
          style={{
            fontSize: '52px',
            fontWeight: 600,
            color: COLORS.text.primary,
            margin: 0,
            textAlign: 'center',
          }}
        >
          Confiado por milhares de{' '}
          <span style={{ color: COLORS.primary[400] }}>investidores</span>
        </h2>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'flex',
          gap: '64px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {stats.map((stat, index) => {
          const statDelay = index * 0.2 * fps;
          const statFrame = Math.max(0, frame - statDelay);

          const statScale = spring({
            frame: statFrame,
            fps,
            config: { damping: 150, stiffness: 200 },
          });

          const statOpacity = interpolate(
            statFrame,
            [0, 0.3 * fps],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                transform: `scale(${statScale})`,
                opacity: statOpacity,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  fontSize: '48px',
                  filter: `drop-shadow(0 4px 12px ${COLORS.primary[500]}40)`,
                }}
              >
                {stat.icon}
              </div>

              {/* Glass card com stat */}
              <div
                style={{
                  backgroundColor: COLORS.glass.bg,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${COLORS.glass.border}`,
                  borderRadius: '24px',
                  padding: '32px 48px',
                  textAlign: 'center',
                  minWidth: '220px',
                  boxShadow: `0 12px 40px rgba(0,0,0,0.4)`,
                }}
              >
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${COLORS.primary[300]}, ${COLORS.primary[500]})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '8px',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    color: COLORS.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Scene 5: Call to Action Final
 * CTA elaborado com design system
 */
const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame,
    fps,
    config: { damping: 200 },
  });

  const pulseScale = interpolate(
    frame,
    [0, 0.5 * fps, 1 * fps, 1.5 * fps, 2 * fps],
    [1, 1.05, 1, 1.05, 1],
    {
      extrapolateRight: 'extend',
    }
  );

  const glowIntensity = interpolate(
    frame,
    [0, 0.5 * fps, 1 * fps],
    [0.3, 0.6, 0.3],
    {
      extrapolateRight: 'extend',
    }
  );

  return (
    <AbsoluteFill
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px',
        opacity,
      }}
    >
      {/* Container com glass morphism */}
      <div
        style={{
          backgroundColor: COLORS.glass.bg,
          backdropFilter: 'blur(24px)',
          border: `2px solid ${COLORS.glass.border}`,
          borderRadius: '40px',
          padding: '80px 120px',
          textAlign: 'center',
          maxWidth: '900px',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 100px ${COLORS.primary[500]}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')}`,
        }}
      >
        <h2
          style={{
            fontSize: '56px',
            fontWeight: 600,
            color: COLORS.text.primary,
            margin: '0 0 24px 0',
            lineHeight: 1.2,
          }}
        >
          Pronto para{' '}
          <span style={{ color: COLORS.primary[400] }}>transformar</span>
          <br />
          seus investimentos?
        </h2>

        <p
          style={{
            fontSize: '24px',
            color: COLORS.text.secondary,
            margin: '0 0 48px 0',
          }}
        >
          Junte-se a milhares de investidores que já usam Axos AI
        </p>

        {/* CTA Button */}
        <div
          style={{
            transform: `scale(${pulseScale})`,
            display: 'inline-block',
          }}
        >
          <div
            style={{
              backgroundColor: COLORS.primary[600],
              padding: '28px 64px',
              borderRadius: '20px',
              boxShadow: `0 0 60px ${COLORS.primary[500]}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')}, 0 12px 32px rgba(0,0,0,0.4)`,
              border: `1px solid ${COLORS.primary[400]}`,
            }}
          >
            <span
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: COLORS.text.primary,
              }}
            >
              Experimente Gratuitamente
            </span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: '32px',
            padding: '16px 32px',
            backgroundColor: `${COLORS.primary[500]}10`,
            borderRadius: '12px',
            border: `1px solid ${COLORS.primary[500]}30`,
            display: 'inline-block',
          }}
        >
          <p
            style={{
              fontSize: '22px',
              color: COLORS.primary[300],
              margin: 0,
              fontWeight: 500,
            }}
          >
            axos.ai
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
