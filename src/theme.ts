export const theme = {
    colors: {
        // Primary brand colors
        primary: '#E8B86D', // Gold accent from mockup
        primaryDark: '#D4A05A',

        // Backgrounds
        background: '#FFFFFF',
        backgroundSecondary: '#F8F8F8',

        // Text
        text: {
            primary: '#000000',
            secondary: '#666666',
            tertiary: '#999999',
        },

        // UI Elements
        border: '#E0E0E0',
        divider: '#F0F0F0',

        // Status
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },

    radius: {
        sm: 8,
        md: 12,
        lg: 16,
        button: 28, // Rounded button from mockup
        full: 9999,
    },

    typography: {
        h1: {
            fontSize: 32,
            fontWeight: 'bold' as const,
            lineHeight: 40,
        },
        h2: {
            fontSize: 24,
            fontWeight: 'bold' as const,
            lineHeight: 32,
        },
        h3: {
            fontSize: 18,
            fontWeight: '600' as const,
            lineHeight: 24,
        },
        body: {
            fontSize: 16,
            fontWeight: 'normal' as const,
            lineHeight: 24,
        },
        small: {
            fontSize: 14,
            fontWeight: 'normal' as const,
            lineHeight: 20,
        },
        tiny: {
            fontSize: 12,
            fontWeight: 'normal' as const,
            lineHeight: 16,
        },
    },
} as const;

export type Theme = typeof theme;
