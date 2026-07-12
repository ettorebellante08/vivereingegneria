/**
 * Home page photography. One landscape photo drives the full-bleed cover band
 * (used as a background with an opaque overlay); the rest compose an editorial
 * mosaic. Add/replace entries here — the layout adapts to the `span` roles.
 */
export type GalleryPhoto = {
  src: string;
  alt: string;
  /** Tile size in the mosaic grid. */
  span?: "normal" | "wide" | "tall" | "big";
};

/** The atmospheric landscape shot used behind the cover band. */
export const GALLERY_COVER: GalleryPhoto = {
  src: "/gallery/evento-02.jpg",
  alt: "Il gruppo di Vivere Ingegneria riunito di sera davanti all'Edificio 7",
};

/** Mosaic photos, ordered for visual rhythm (one focal + supporting shots). */
export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    src: "/gallery/evento-04.jpg",
    alt: "Il gruppo di Vivere Ingegneria in posa sotto il monumento con l'aereo, con gli striscioni dell'associazione",
    span: "big",
  },
  {
    src: "/gallery/evento-01.jpg",
    alt: "Foto di gruppo nel corridoio della facoltà con lo striscione dell'associazione",
    span: "tall",
  },
  {
    src: "/gallery/evento-06.jpg",
    alt: "Foto di gruppo all'aperto tra gli alberi del campus",
    span: "normal",
  },
  {
    src: "/gallery/evento-05.jpg",
    alt: "Un momento conviviale della serata sotto i portici",
    span: "normal",
  },
  {
    src: "/gallery/evento-03.jpg",
    alt: "Festeggiamenti nel corridoio della facoltà con la torta di compleanno",
    span: "wide",
  },
];
