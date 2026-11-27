import { sections } from "@/data/sections"

/* Types are defined from the data */

export type SectionName = (typeof sections)[number]["name"]

export type Section = {
  name: SectionName
  icon: string
  components: CatalogComponent[]
}

export type ComponentName = (typeof sections)[number]["components"][number]["name"]

export type CatalogComponent = {
  name: ComponentName
  aliases?: string[]
  help: string
}
