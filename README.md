# ConsultRenov

Site vitrine Astro pour ConsultRenov.

## Commandes utiles

```sh
npm install
npm run dev
npm run check
npm run build
npm run preview
```

- `npm run dev` lance le site en local sur `http://localhost:4321`
- `npm run check` vérifie Astro et TypeScript
- `npm run build` génère la version statique dans `dist/`
- `npm run preview` sert la version buildée localement

## Structure utile

- `src/pages/` : pages du site
- `src/data/services.ts` : source de vérité des services
- `src/data/gallery.ts` : contenu de la galerie
- `public/assets/gallery/` : images locales de la galerie
- `src/data/navigation.ts` : liens du menu
- `src/data/seo.ts` : titres et descriptions SEO

## Gérer la galerie

La galerie est simple à maintenir. Tout est géré sans base de données.

### Ajouter une image

1. Déposer l’image dans `public/assets/gallery/`
2. Ajouter une entrée dans `src/data/gallery.ts`
3. Renseigner au minimum :
   - `id` : identifiant technique unique, en ASCII de préférence
   - `title` : titre affiché
   - `image` : chemin public, par exemple `assets/gallery/mon-image.jpg`
   - `alt` : description accessibilité de l’image
   - `description` : texte affiché sous l’image
   - `services` : liste des types associés

Exemple :

```ts
{
  id: "chantier-facade-evreux",
  title: "Rénovation de façade à Évreux",
  image: "assets/gallery/chantier-facade-evreux.jpg",
  alt: "Façade de maison rénovée avec finition claire",
  description: "Exemple de chantier façade avec rendu propre et lumineux.",
  services: ["facade"],
}
```

### Changer le titre, la description ou le texte d’une image

Tout se fait directement dans `src/data/gallery.ts`.

- `title` : titre de la carte
- `description` : texte affiché
- `alt` : texte alternatif de l’image

Vous pouvez mettre les accents directement dans le code : `é`, `è`, `à`, `ç`, etc.

### Changer le type d’une image

Le type d’une image correspond au tableau `services` dans `src/data/gallery.ts`.

Exemples :

- une image liée uniquement à la façade :

```ts
services: ["facade"]
```

- une image liée à plusieurs services :

```ts
services: ["facade", "revetements-de-sol-et-exterieurs"]
```

La galerie utilise les slugs techniques des services. Les libellés affichés sont générés automatiquement à partir de `src/data/services.ts`.

## Gérer les types de service

Les types disponibles dans les filtres de la galerie viennent de `src/data/services.ts`.

### Modifier le libellé d’un type existant

Dans `src/data/services.ts`, modifier :

- `title` : nom complet affiché
- `shortTitle` : nom court utilisé dans certains blocs et filtres

Exemple :

```ts
{
  slug: "facade",
  title: "Façade",
  shortTitle: "Façade",
}
```

### Ajouter un nouveau type

1. Ajouter un nouveau service dans `src/data/services.ts`
2. Lui donner un `slug` stable en ASCII
3. Utiliser ce `slug` dans `src/data/gallery.ts` dans le champ `services`

Exemple :

```ts
{
  slug: "isolation-interieure",
  title: "Isolation intérieure",
  shortTitle: "Isolation intérieure",
  icon: "energy",
  summary: "...",
  intro: "...",
  benefits: ["...", "...", "..."],
  items: ["..."],
  seoTitle: "...",
  seoDescription: "...",
  highlight: "...",
}
```

Dès que le service existe dans `src/data/services.ts`, il peut être utilisé dans la galerie.

## Règles importantes

- Les textes visibles peuvent contenir des accents directement dans le code.
- Ne pas utiliser d’entités HTML comme `&eacute;`.
- Garder les identifiants techniques en ASCII :
  - `slug`
  - `id`
  - noms de fichiers image
- Après ajout d’une nouvelle page ou gros changement de contenu, redémarrer `npm run dev` si le serveur local ne recharge pas correctement.

## Vérifications recommandées après modification

```sh
npm run check
npm run build
```

Pour la galerie :

```sh
npx playwright test tests/gallery.spec.ts
```
