import type { ImageMetadata } from "astro";
import type { TechnologyId } from "../../../data/technologies";

export interface ProjectImage {
  src: ImageMetadata;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  technologies: readonly TechnologyId[];
  cover: ProjectImage;
  gallery: readonly ProjectImage[];
  repositoryUrl?: string;
  liveUrl?: string;
}