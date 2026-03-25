import { z } from "zod";
import { services, type Service } from "./services";

const serviceSlugSet = new Set(services.map((service) => service.slug));

const galleryItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  alt: z.string(),
  description: z.string(),
  services: z
    .array(z.string())
    .min(1)
    .refine(
      (slugs) => slugs.every((slug) => serviceSlugSet.has(slug)),
      "Unknown service slug in gallery item",
    ),
});

export type GalleryItem = Omit<z.infer<typeof galleryItemSchema>, "services"> & {
  services: Service["slug"][];
};

const galleryList = [
  {
    id: "maison-moderne-menuiserie",
    title: "Maison moderne et ouvertures valorisées",
    image: "assets/gallery/maison-moderne-menuiserie.jpg",
    alt: "Maison contemporaine au crépuscule avec grandes ouvertures et façade éclairée",
    description:
      "Exemple de visuel pour illustrer une façade modernisée avec des menuiseries extérieures bien mises en valeur.",
    services: ["menuiserie", "facade"],
  },
  {
    id: "facade-architecture-claire",
    title: "Façade contemporaine aux lignes nettes",
    image: "assets/gallery/facade-architecture-claire.jpg",
    alt: "Façade claire d'une habitation contemporaine avec détails architecturaux extérieurs",
    description:
      "Visuel de démonstration pour projeter le client sur un rendu de façade propre, lumineux et structuré.",
    services: ["facade"],
  },
  {
    id: "pergola-espace-detente",
    title: "Pergola pour un espace de détente ombragé",
    image: "assets/gallery/pergola-espace-detente.jpg",
    alt: "Pergola extérieure couvrant un espace de détente avec assises",
    description:
      "Exemple de rendu pour les projets de pergola ou de confort extérieur avec zone de vie ombragée.",
    services: ["pergola-veranda-confort-exterieur"],
  },
  {
    id: "veranda-colonnade",
    title: "Véranda et extension ouverte sur l'extérieur",
    image: "assets/gallery/veranda-colonnade.jpg",
    alt: "Véranda avec colonnade ouverte sur un extérieur paysager",
    description:
      "Visuel de démonstration pour illustrer une extension vitrée ou un espace de transition intérieur-extérieur.",
    services: ["pergola-veranda-confort-exterieur", "facade"],
  },
  {
    id: "chantier-toiture-gouttieres",
    title: "Réfection de toiture et gouttières",
    image: "assets/gallery/chantier-toiture-gouttieres.jpg",
    alt: "Artisans en intervention sur une toiture avec remplacement de gouttières",
    description:
      "Exemple pour les projets de couverture, d'entretien de toiture et de traitement des évacuations d'eaux pluviales.",
    services: ["toiture"],
  },
  {
    id: "toiture-solaire",
    title: "Toiture équipée de panneaux solaires",
    image: "assets/gallery/toiture-solaire.jpg",
    alt: "Toiture de maison avec panneaux solaires installés",
    description:
      "Visuel d'inspiration pour associer rénovation de toiture et solutions énergétiques comme les panneaux solaires.",
    services: ["toiture", "chauffage-et-energies-renouvelables"],
  },
  {
    id: "allee-paves-drainants",
    title: "Allée extérieure en pavés",
    image: "assets/gallery/allee-paves-drainants.jpg",
    alt: "Allée en pavés devant une habitation",
    description:
      "Exemple de revêtement extérieur pour illustrer les accès, les circulations et les finitions soignées autour du bien.",
    services: ["revetements-de-sol-et-exterieurs"],
  },
  {
    id: "terrasse-bois-exterieure",
    title: "Terrasse aménagée pour les usages quotidiens",
    image: "assets/gallery/terrasse-bois-exterieure.jpg",
    alt: "Terrasse en bois avec mobilier extérieur devant une maison",
    description:
      "Visuel de démonstration pour les zones de circulation ou de détente avec une finition extérieure confortable.",
    services: ["revetements-de-sol-et-exterieurs", "pergola-veranda-confort-exterieur"],
  },
  {
    id: "porte-garage-menuiserie",
    title: "Porte de garage et fermeture extérieure",
    image: "assets/gallery/porte-garage-menuiserie.jpg",
    alt: "Porte de garage métallique fraîchement installée sur une maison",
    description:
      "Exemple pour mettre en avant les fermetures extérieures, les portes de garage et les interventions de menuiserie.",
    services: ["menuiserie"],
  },
  {
    id: "maison-allee-valorisee",
    title: "Accès valorisé et lecture extérieure soignée",
    image: "assets/gallery/maison-allee-valorisee.jpg",
    alt: "Maison avec allée extérieure aménagée et façade visible",
    description:
      "Visuel test pour montrer comment façade et revêtements extérieurs peuvent être présentés ensemble dans la galerie.",
    services: ["facade", "revetements-de-sol-et-exterieurs"],
  },
] as const;

export const galleryItems = z.array(galleryItemSchema).parse(galleryList) as GalleryItem[];
