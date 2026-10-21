import type { Product } from '../types';

export type RootStackParamList = {
    Scanner: undefined;
    Results: undefined;
    Closet: undefined;
    TryOn: { product: Product };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}
