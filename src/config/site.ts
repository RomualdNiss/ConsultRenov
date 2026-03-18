const configuredSiteUrl = import.meta.env.PUBLIC_SITE_URL || "https://www.consultrenov.fr/";
const publicSiteUrl = new URL(configuredSiteUrl).toString();

export const siteConfig = {
  name: "ConsultRenov",
  legalName: "ConsultRenov",
  description:
    "ConsultRenov accompagne vos projets de rénovation énergétique et d'amélioration de l'habitat à Guichainville, Évreux et alentours.",
  siteUrl: publicSiteUrl,
  phone: "06 79 22 54 80",
  phoneHref: "tel:+33679225480",
  email: "contact.consultrenov@gmail.com",
  emailHref: "mailto:contact.consultrenov@gmail.com",
  addressLine: "80 rue Nungesser et Coli",
  postalCode: "27930",
  city: "Guichainville",
  serviceArea: ["Guichainville", "Évreux", "agglomération d'Évreux", "secteurs alentours"],
  socials: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
  ],
  ctaPrimary: "Demander un devis gratuit",
  ctaSecondary: "Être rappelé sous 48h",
  heroTagline: "Rénovation sur mesure au service de votre confort",
} as const;

export const formConfig = {
  endpoint:
    import.meta.env.PUBLIC_FORM_ENDPOINT ||
    "https://formsubmit.co/contact.consultrenov@gmail.com",
  subject: "Nouvelle demande de devis - ConsultRenov",
} as const;

export const legalPlaceholders = {
  companyStatus: "À confirmer avant mise en ligne",
  siret: "À confirmer avant mise en ligne",
  vatNumber: "À confirmer avant mise en ligne",
  publishingDirector: "À confirmer avant mise en ligne",
  host: "À confirmer avant mise en ligne",
} as const;
