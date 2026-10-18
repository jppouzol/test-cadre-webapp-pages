// Variables fixées par la CI à la construction (voir .github/workflows).
interface ImportMetaEnv {
  readonly VITE_CANAL?: 'prod' | 'recette' | 'preview';
  readonly VITE_PR?: string;
  readonly VITE_VERSION?: string;
}
