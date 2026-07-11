/**
 * Home page photo gallery. Add new entries here as photos become available —
 * the grid layout adapts automatically (`span` controls tile size).
 */
export type GalleryPhoto = {
  src: string;
  alt: string;
  /** Tile size in the mosaic grid. */
  span?: "normal" | "wide" | "tall" | "big";
};

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
    src: "/gallery/evento-02.jpg",
    alt: "Il gruppo riunito di sera davanti all'Edificio 7, con lo striscione Vivere Ingegneria",
    span: "wide",
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
