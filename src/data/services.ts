import { z } from "zod";

const serviceSchema = z.object({
  slug: z.string(),
  title: z.string(),
  shortTitle: z.string(),
  icon: z.string(),
  summary: z.string(),
  intro: z.string(),
  benefits: z.array(z.string()).length(3),
  items: z.array(z.string()).min(1),
  seoTitle: z.string(),
  seoDescription: z.string(),
  highlight: z.string(),
});

export type Service = z.infer<typeof serviceSchema>;

const serviceList = [
  {
    slug: "menuiserie",
    title: "Menuiserie",
    shortTitle: "Menuiserie",
    icon: "window",
    summary:
      "Fenêtres, portes, volets, portails et fermetures pour renforcer isolation, sécurité et esthétique.",
    intro:
      "ConsultRenov accompagne vos projets de menuiserie extérieure pour moderniser l'habitat et améliorer le confort au quotidien.",
    benefits: [
      "Amélioration du confort thermique et acoustique",
      "Valorisation immédiate de la façade et des accès",
      "Solutions sur mesure pour l'ouverture, la protection et la finition",
    ],
    items: ["Fenêtre", "Porte", "Volet", "Portail", "Porte de garage", "Clôture"],
    seoTitle: "Menuiserie à Évreux et Guichainville",
    seoDescription:
      "Fenêtres, portes, volets, portails et fermetures sur mesure avec accompagnement personnalisé à Évreux et Guichainville.",
    highlight: "Confort, sécurité et finitions soignées",
  },
  {
    slug: "pergola-veranda-confort-exterieur",
    title: "Pergola, Véranda & confort extérieur",
    shortTitle: "Confort extérieur",
    icon: "sun",
    summary:
      "Pergolas, vérandas et stores pour prolonger les espaces de vie et maîtriser lumière, ombrage et confort.",
    intro:
      "Les solutions extérieures sont pensées pour profiter davantage de la maison et de ses abords dans un style cohérent et premium.",
    benefits: [
      "Création d'espaces extérieurs plus agréables à vivre",
      "Gestion du soleil et de l'ombrage selon les usages",
      "Finitions harmonisées avec l'habitat existant",
    ],
    items: ["Pergola", "Véranda", "Stores"],
    seoTitle: "Pergola et véranda à Évreux",
    seoDescription:
      "Pergolas, vérandas et stores pour améliorer le confort extérieur et prolonger les espaces de vie autour d'Évreux.",
    highlight: "Des extérieurs plus confortables et mieux valorisés",
  },
  {
    slug: "toiture",
    title: "Toiture",
    shortTitle: "Toiture",
    icon: "roof",
    summary:
      "Protection, isolation et finition de toiture avec solutions ciblées pour la couverture et les combles.",
    intro:
      "ConsultRenov intervient sur les éléments de toiture qui participent à la protection du bâti, à l'isolation et au confort global.",
    benefits: [
      "Meilleure protection durable de l'habitat",
      "Isolation des combles et optimisation thermique",
      "Traitement des points de lumière et de gestion des eaux",
    ],
    items: [
      "Hydrofuge de toiture",
      "Isolation des combles",
      "Caches-moineaux",
      "Velux",
      "Gouttières",
    ],
    seoTitle: "Travaux de toiture à Évreux",
    seoDescription:
      "Hydrofuge, isolation des combles, Velux, caches-moineaux et gouttières pour protéger et améliorer votre habitat à Évreux.",
    highlight: "Protection du bâti et performance thermique",
  },
  {
    slug: "facade",
    title: "Façade",
    shortTitle: "Façade",
    icon: "facade",
    summary:
      "Isolation extérieure, ravalement, peinture et bardage pour rénover, protéger et moderniser les façades.",
    intro:
      "La façade concentre l'image de la maison et sa performance. ConsultRenov propose des prestations cohérentes pour la remettre en valeur.",
    benefits: [
      "Amélioration de l'enveloppe du bâtiment",
      "Lecture visuelle plus moderne et rassurante",
      "Traitements adaptés aux besoins de finition et de protection",
    ],
    items: ["Isolation extérieure", "Ravalement", "Peinture", "Bardage"],
    seoTitle: "Ravalement et isolation extérieure à Évreux",
    seoDescription:
      "Isolation extérieure, ravalement, peinture et bardage pour moderniser et protéger votre façade à Évreux et Guichainville.",
    highlight: "Une façade performante, nette et durable",
  },
  {
    slug: "revetements-de-sol-et-exterieurs",
    title: "Revêtements de sol & extérieurs",
    shortTitle: "Revêtements",
    icon: "tiles",
    summary:
      "Revêtements de sol, béton drainant et gomme pour structurer les accès et améliorer la qualité d'usage des extérieurs.",
    intro:
      "ConsultRenov accompagne les finitions extérieures qui participent à la lisibilité, au confort d'usage et à la durabilité de vos aménagements.",
    benefits: [
      "Des accès plus propres, plus lisibles et plus durables",
      "Solutions pensées pour l'usage quotidien et la circulation",
      "Finitions extérieures cohérentes avec l'image du bien",
    ],
    items: ["Revêtement de sol", "Béton drainant", "Gomme"],
    seoTitle: "Revêtements extérieurs à Évreux",
    seoDescription:
      "Revêtements de sol, béton drainant et solutions extérieures pour valoriser vos accès et circulations autour d'Évreux.",
    highlight: "Des extérieurs pratiques, nets et durables",
  },
  {
    slug: "chauffage-et-energies-renouvelables",
    title: "Chauffage & énergies renouvelables",
    shortTitle: "Chauffage & ENR",
    icon: "energy",
    summary:
      "Pompes à chaleur, chaudières à condensation, ballons thermodynamiques et panneaux solaires pour un confort piloté.",
    intro:
      "L'amélioration de l'habitat passe aussi par des équipements cohérents avec vos besoins de confort, d'efficacité et d'usage.",
    benefits: [
      "Des équipements orientés confort et performance",
      "Une approche globale des besoins énergétiques du foyer",
      "Des projets pouvant intégrer les aides envisageables selon l'éligibilité",
    ],
    items: [
      "Pompe à chaleur",
      "Chaudière à condensation",
      "Ballon thermodynamique",
      "Panneaux solaires",
    ],
    seoTitle: "Pompe à chaleur et rénovation énergétique à Évreux",
    seoDescription:
      "Pompe à chaleur, ballon thermodynamique, chaudière à condensation et panneaux solaires pour vos projets énergétiques à Évreux.",
    highlight: "Confort piloté et solutions énergétiques adaptées",
  },
] as const;

export const services = z.array(serviceSchema).parse(serviceList);

export const featuredServiceSlugs = [
  "menuiserie",
  "facade",
  "toiture",
  "chauffage-et-energies-renouvelables",
] as const;
