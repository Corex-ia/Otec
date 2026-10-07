/**
 * TOKENS DE ANIMACIÓN REUTILIZABLES
 * Sistema CRM-LUMEN-WEB
 * 
 * Centraliza todas las variantes de animación Motion (Framer Motion)
 * para mantener consistencia en toda la aplicación.
 * 
 * Basado en: /GUIA_MOTION_ANIMACIONES.md
 */

export const AnimationTokens = {
  /**
   * EASING FUNCTIONS
   */
  easings: {
    easeOut: [0.22, 1, 0.36, 1] as const,
    easeIn: [0.4, 0, 1, 1] as const,
    easeInOut: [0.4, 0, 0.2, 1] as const,
    spring: { type: 'spring' as const, stiffness: 100, damping: 15 },
  },

  /**
   * DURACIONES ESTÁNDAR
   */
  durations: {
    fast: 0.2,      // 200ms - Hover, feedback inmediato
    normal: 0.3,    // 300ms - Transiciones estándar
    slow: 0.5,      // 500ms - Scroll reveals
    slower: 0.8,    // 800ms - Animaciones complejas
  },

  /**
   * SCROLL REVEALS (Entrada de elementos)
   */
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  },

  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  },

  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  },

  slideInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    }
  },

  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    }
  },

  /**
   * STAGGER CHILDREN (Animación en cascada)
   */
  staggerChildren: (delay = 0.1) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: delay,
        delayChildren: 0.2
      }
    }
  }),

  staggerFast: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  },

  staggerNormal: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  },

  staggerSlow: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  },

  /**
   * CHILD VARIANTS (para usar con stagger)
   */
  childFadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  },

  childScaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4 }
    }
  },

  /**
   * HOVER STATES
   */
  hoverLift: {
    scale: 1.02,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  },

  hoverScale: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },

  hoverScaleSmall: {
    scale: 1.02,
    transition: { duration: 0.2 }
  },

  hoverRotate: (degrees = 15) => ({
    rotate: degrees,
    scale: 1.1,
    transition: { duration: 0.3 }
  }),

  /**
   * TAP/CLICK FEEDBACK
   */
  tapScale: {
    scale: 0.95
  },

  tapScaleSmall: {
    scale: 0.98
  },

  /**
   * TRANSITIONS ENTRE ESTADOS (Tabs, Modals)
   */
  tabTransition: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 }
  },

  modalTransition: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
    transition: { duration: 0.3 }
  },

  backdropTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  },

  /**
   * ANIMACIONES DE FONDO (Background)
   */
  breathingEffect: {
    animate: {
      scale: [1, 1.05, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  gradientAnimation: (duration = 8) => ({
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
    },
    transition: {
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }),

  pulseAnimation: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  /**
   * LOADING STATES
   */
  spinnerRotation: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: "linear" }
  },

  pulseLoader: {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [1, 0.5, 1]
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },

  /**
   * SUCCESS STATES
   */
  successCheckmark: {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }
    }
  },

  successBadge: {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        stiffness: 150,
        damping: 12
      }
    }
  },

  /**
   * VIEWPORT SETTINGS
   */
  viewport: {
    once: true,           // Solo animar una vez
    margin: "-100px"      // Trigger antes de entrar en viewport
  },

  viewportRepeating: {
    once: false,
    margin: "-50px"
  },

  /**
   * LAYOUT ANIMATIONS
   */
  layoutTransition: {
    layout: true,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  },
};

/**
 * HELPER: Crear variante personalizada de fadeInUp con delay
 */
export const createDelayedFadeInUp = (delay: number) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1],
      delay 
    }
  }
});

/**
 * HELPER: Crear stagger con delay personalizado
 */
export const createStagger = (childDelay: number, parentDelay = 0.2) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: childDelay,
      delayChildren: parentDelay
    }
  }
});

/**
 * HELPER: Verificar si el usuario prefiere reducir movimiento
 * Usar con useReducedMotion() de motion/react
 */
export const getAccessibleVariant = (
  shouldReduceMotion: boolean,
  fullVariant: any,
  reducedVariant: any = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
) => {
  return shouldReduceMotion ? reducedVariant : fullVariant;
};
