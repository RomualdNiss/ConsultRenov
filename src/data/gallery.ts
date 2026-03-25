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
    title: "Maison moderne et ouvertures valorisees",
    image: "assets/gallery/maison-moderne-menuiserie.jpg",
    alt: "Maison contemporaine au crepuscule avec grandes ouvertures et facade eclairee",
    description:
      "Exemple de visuel pour illustrer une facade modernisee avec des menuiseries exterieures bien mises en valeur.",
    services: ["menuiserie", "facade"],
  },
  {
    id: "facade-architecture-claire",
    title: "Facade contemporaine aux lignes nettes",
    image: "assets/gallery/facade-architecture-claire.jpg",
    alt: "Facade claire d'une habitation contemporaine avec details architecturaux exterieurs",
    description:
      "Visuel de demonstration pour projeter le client sur un rendu de facade propre, lumineux et structure.",
    services: ["facade"],
  },
  {
    id: "pergola-espace-detente",
    title: "Pergola pour un espace de detente ombrage",
    image: "assets/gallery/pergola-espace-detente.jpg",
    alt: "Pergola exterieure couvrant un espace de detente avec assises",
    description:
      "Exemple de rendu pour les projets de pergola ou de confort exterieur avec zone de vie ombragee.",
    services: ["pergola-veranda-confort-exterieur"],
  },
  {
    id: "veranda-colonnade",
    title: "Veranda et extension ouverte sur l'exterieur",
    image: "assets/gallery/veranda-colonnade.jpg",
    alt: "Veranda avec colonnade ouverte sur un exterieur paysager",
    description:
      "Visuel de demonstration pour illustrer une extension vitree ou un espace de transition interieur-exterieur.",
    services: ["pergola-veranda-confort-exterieur", "facade"],
  },
  {
    id: "chantier-toiture-gouttieres",
    title: "Refection de toiture et gouttieres",
    image: "assets/gallery/chantier-toiture-gouttieres.jpg",
    alt: "Artisans en intervention sur une toiture avec remplacement de gouttieres",
    description:
      "Exemple pour les projets de couverture, entretien de toiture et traitement des evacuations d'eaux pluviales.",
    services: ["toiture"],
  },
  {
    id: "toiture-solaire",
    title: "Toiture equipee de panneaux solaires",
    image: "assets/gallery/toiture-solaire.jpg",
    alt: "Toiture de maison avec panneaux solaires installes",
    description:
      "Visuel d'inspiration pour associer renovation de toiture et solutions energetiques comme les panneaux solaires.",
    services: ["toiture", "chauffage-et-energies-renouvelables"],
  },
  {
    id: "allee-paves-drainants",
    title: "Allee exterieure en paves",
    image: "assets/gallery/allee-paves-drainants.jpg",
    alt: "Allee en paves devant une habitation",
    description:
      "Exemple de revetement exterieur pour illustrer les acces, circulations et finitions soignees autour du bien.",
    services: ["revetements-de-sol-et-exterieurs"],
  },
  {
    id: "terrasse-bois-exterieure",
    title: "Terrasse amenagee pour les usages quotidiens",
    image: "assets/gallery/terrasse-bois-exterieure.jpg",
    alt: "Terrasse en bois avec mobilier exterieur devant une maison",
    description:
      "Visuel de demonstration pour les zones de circulation ou de detente avec une finition exterieure confortable.",
    services: ["revetements-de-sol-et-exterieurs", "pergola-veranda-confort-exterieur"],
  },
  {
    id: "porte-garage-menuiserie",
    title: "Porte de garage et fermeture exterieure",
    image: "assets/gallery/porte-garage-menuiserie.jpg",
    alt: "Porte de garage metallique fraichement installee sur une maison",
    description:
      "Exemple pour mettre en avant les fermetures exterieures, portes de garage et interventions de menuiserie.",
    services: ["menuiserie"],
  },
  {
    id: "maison-allee-valorisee",
    title: "Acces valorise et lecture exterieure soignee",
    image: "assets/gallery/maison-allee-valorisee.jpg",
    alt: "Maison avec allee exterieure amenagee et facade visible",
    description:
      "Visuel test pour montrer comment facade et revetements exterieurs peuvent etre presentes ensemble dans la galerie.",
    services: ["facade", "revetements-de-sol-et-exterieurs"],
  },
] as const;

export const galleryItems = z.array(galleryItemSchema).parse(galleryList) as GalleryItem[];
