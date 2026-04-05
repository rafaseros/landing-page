import type { SiteMetadata, Highlight } from './types';

export const siteMetadata: SiteMetadata = {
  name: "Rafael Gallegos",
  title: "Rafael Gallegos | Tech Lead en Healthtech",
  description: "Desarrollador con más de 12 años de experiencia. Líder de desarrollo en Clínica Foianini, especializado en transformación digital en el sector salud.",
  url: "https://devrafaseros.com",
  ogImage: "/og-image.png",
  locale: "es_BO",
};

export const highlights: Highlight[] = [
  { label: "Años de experiencia", numericValue: 12, suffix: "+", displayValue: "12+" },
  { label: "Personas en mi equipo", numericValue: 7, displayValue: "7" },
  { label: "Años en Clínica Foianini", numericValue: 5, displayValue: "5" },
  { label: "Sectores de industria", numericValue: 4, displayValue: "4" },
];
