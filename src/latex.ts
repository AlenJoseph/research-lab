import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { topicDir, templatesDir } from "./paths.js";
import { bibKey } from "./bib.js";

function convertCitations(text: string): string {
  return text.replace(/\[@s2:([^\]]+)\]/g, (_, paperId) => `\\cite{${bibKey(paperId)}}`);
}

export async function buildLatex(topicPath: string): Promise<void> {
  const base = topicDir(topicPath);
  const sectionsDir = join(base, "draft", "sections");
  const latexDir = join(base, "latex");

  let sectionFiles: string[] = [];
  try {
    sectionFiles = (await readdir(sectionsDir))
      .filter((f) => f.endsWith(".md"))
      .sort();
  } catch {
    sectionFiles = [];
  }

  const preamble = await readFile(join(templatesDir(), "article.tex"), "utf-8");

  const bodyParts: string[] = [];

  for (const file of sectionFiles) {
    const name = file.replace(/\.md$/, "");
    const title = name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const raw = await readFile(join(sectionsDir, file), "utf-8");
    const content = convertCitations(raw)
      .replace(/^# .+\n+/m, "")
      .trim();
    bodyParts.push(`\\section{${title}}\n\n${content}\n`);
  }

  const [beforeDoc, afterDocStart] = preamble.split("\\begin{document}");
  const afterDoc = afterDocStart.split("\\end{document}");
  const inner = (afterDoc[0] ?? "")
    .replace(/\\bibliographystyle\{[^}]*\}/g, "")
    .replace(/\\bibliography\{[^}]*\}/g, "")
    .trim();

  const mainTex = `${beforeDoc}\\begin{document}\n\n${inner}\n\n${bodyParts.join("\n")}\n\\bibliographystyle{plain}\n\\bibliography{references}\n\\end{document}${afterDoc[1] ?? ""}`;

  await writeFile(join(latexDir, "main.tex"), mainTex, "utf-8");
  console.log(`LaTeX written to ${join(latexDir, "main.tex")}`);
  console.log("Run: cd latex && latexmk -pdf main.tex");
}
