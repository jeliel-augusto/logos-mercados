/**
 * Entidade Client
 * Representa uma loja no sistema, um mercado, supermercado, farmácia, etc.
 */
export interface Client {
  id: string;
  name: string;
  logo_url: string;
  theme_color_primary: string;
  theme_color_secondary: string;
}
