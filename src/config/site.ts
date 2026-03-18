const configuredSiteUrl = import.meta.env.PUBLIC_SITE_URL || "https://www.consultrenov.fr/";
const publicSiteUrl = new URL(configuredSiteUrl).toString();

export const siteConfig = {
  name: "ConsultRenov",
  legalName: "CONSULT'RENOV",
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
    { label: "Linkedin", href: "https://fr.linkedin.com/in/consult-renov-7573043a9" },
    { label: "Instagram", href: "https://www.instagram.com/consultrenov/" },
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

export const reviewsConfig = {
  enabled: true,
  provider: "generic",
  widgetTitle: "Ils nous font confiance pour leurs travaux",
  widgetIntro:
    "Consultez les avis laissés par nos clients sur Google et découvrez les retours d'expérience sur la qualité de l'accompagnement et des réalisations.",
  reviewCount: "50+",
  reviewCountLabel: "avis Google",
  googleBusinessUrl: import.meta.env.PUBLIC_GOOGLE_REVIEWS_URL || "",
  widgetHtml: import.meta.env.PUBLIC_REVIEWS_WIDGET_HTML || "",
} as const;

export const legalPlaceholders = {
  companyStatus: "SAS (Société par actions simplifiée)",
  siret: "98990670600019",
  vatNumber: "FR43989906706",
  publishingDirector: "À définir (président de la société)",
  host: "À définir (ex : Vercel, Hostinger, OVH...)",
} as const;
