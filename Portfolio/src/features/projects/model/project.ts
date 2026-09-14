import type { ImageMetadata } from "astro";
import type { TechnologyId } from "../../../data/technologies";

export interface ProjectImage {
  src: ImageMetadata;
  alt: string;
  title?: string;
  description?: string;
  highlights?: readonly string[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  introduction?: string;
  decisions?: readonly { title: string; text: string; images?: readonly ProjectImage[] }[];
  technologies: readonly TechnologyId[];
  cover: ProjectImage;
  gallery: readonly ProjectImage[];
  repositoryUrl?: string;
  liveUrl?: string;
  category?: string;
  role?: string;
  client?: string;
  team?: string;
  dateLabel?: string;
  status?: string;
  tags?: readonly string[];
  tools?: readonly string[];
  problem?: string;
  challengeImage?: ProjectImage;
  solution?: string;
  technicalDecisions?: string;
  learnings?: string;
  result?: string;
}
