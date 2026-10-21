// ============================================
// PROFESSIONAL FASHION DETECTION TYPES
// ============================================

export interface FashionItem {
    id: string;
    category: string;
    subCategory: string;
    genderTarget: string;
    style: string;
    colorMain: string;
    colors?: string[];
    colorPalette: string[];
    pattern: string;
    materialGuess: string;
    fit: string;
    necklineOrCollar: string;
    length: string;
    brandGuess: string;
    visibleLogosOrText: string;
    occasion: string[];
    qualityScore: number;
    confidenceScore: number;
    notes: string;
}

export interface StructuredDetectionResult {
    items: FashionItem[];
    overallImageQuality: number;
    issues: string[];
}

export interface SearchQueryResult {
    searchQuery: string;
    requiredKeywords: string[];
    optionalKeywords: string[];
    negativeKeywords: string[];
    shortTitle: string;
    fallbackQuery: string;
}

export interface ProductMatchScore {
    id: string;
    matchScore: number;
    reasons: string[];
    isBestMatchCandidate: boolean;
    isTooDifferent: boolean;
}

export interface PhotoQualityCheck {
    isUsable: boolean;
    reason: string;
    userMessage: string;
    suggestions: string[];
}

export interface OutfitSuggestion {
    title: string;
    description: string;
}

export interface StylingResult {
    scanSummary: string;
    outfitSuggestions: OutfitSuggestion[];
    recommendedOccasions: string[];
}
