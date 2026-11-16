/**
 * Third-party media used in the demo, with credits.
 *
 * ⚠ TEMPORARY: the hero photo below is not ours and we hold no license for it.
 * A credit is a courtesy, not permission. Replace it with the team's own photo
 * (or one under a license that allows reuse) before any public or commercial use.
 * It is loaded from the owner's server (not copied into this repo); set
 * `HERO_PHOTO = null` to remove it everywhere, and the placeholder comes back.
 */
export interface Credit {
  src: string;
  alt: string;
  owner: string;
  sourceUrl: string;
  note: string;
}

export const HERO_PHOTO: Credit | null = {
  src: 'https://www.asaporg.com/wp-content/uploads/2025/08/8eaf6b0bb679070b042cd8cd32483634.jpg',
  alt: 'A young woman with a headset smiles while studying at her laptop',
  owner: 'American Society of Administrative Professionals (asaporg.com)',
  sourceUrl: 'https://www.asaporg.com/wp-content/uploads/2025/08/8eaf6b0bb679070b042cd8cd32483634.jpg',
  note: 'Temporary placeholder for a non-commercial school demo. All rights belong to the owner. Will be replaced with our own photo.',
};

export const CREDITS: Credit[] = HERO_PHOTO ? [HERO_PHOTO] : [];
