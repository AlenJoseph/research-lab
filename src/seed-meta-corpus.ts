/**
 * Curated meta corpus: AI foundations + world models + meta-memory.
 * Uses S2 title match (avoids wrong arXiv ID collisions).
 */
import { readManifest, ingestPaperData } from "./corpus.js";
import { metaManifestPath } from "./paths.js";
import { loadEnv } from "./env.js";
import { S2Client } from "./s2/client.js";
import type { PaperRole } from "./types.js";

type SeedEntry = {
  title?: string;
  paperId?: string;
  role: PaperRole;
  why: string;
  category: string;
};

const CORPUS: SeedEntry[] = [
  // --- AI inception & core ML ---
  {
    category: "foundations",
    title: "Computing Machinery and Intelligence",
    role: "foundation",
    why: "Turing test and origins of AI as a research program",
  },
  {
    category: "foundations",
    title: "A Proposal for the Dartmouth Summer Research Project on Artificial Intelligence",
    role: "foundation",
    why: "Dartmouth workshop — birth of AI as a field",
  },
  {
    category: "foundations",
    title: "Learning representations by back-propagating errors",
    role: "foundation",
    why: "Backpropagation for multi-layer networks",
  },
  {
    category: "foundations",
    title: "Long Short-Term Memory",
    role: "foundation",
    why: "LSTM — recurrent memory for sequences",
  },
  {
    category: "foundations",
    title: "Gradient-based learning applied to document recognition",
    role: "foundation",
    why: "LeNet — CNNs for visual recognition",
  },
  {
    category: "foundations",
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    role: "foundation",
    why: "AlexNet — deep learning breakthrough on vision",
  },
  {
    category: "foundations",
    paperId: "2913c2bf3f92b5ae369400a42b2d27cc5bc05ecb",
    role: "foundation",
    why: "LeCun/Bengio/Hinton Nature 2015 — deep learning review",
  },
  {
    category: "foundations",
    title: "Attention Is All You Need",
    role: "foundation",
    why: "Transformer architecture",
  },
  {
    category: "foundations",
    title: "Human-level control through deep reinforcement learning",
    role: "foundation",
    why: "DQN — deep RL from pixels",
  },
  {
    category: "foundations",
    title: "Mastering the game of Go with deep neural networks and tree search",
    role: "foundation",
    why: "AlphaGo — planning + deep networks",
  },
  {
    category: "foundations",
    title: "Language Models are Few-Shot Learners",
    role: "foundation",
    why: "GPT-3 — scale and in-context learning",
  },

  // --- World models & predictive state ---
  {
    category: "world-models",
    paperId: "ARXIV:1803.10122",
    role: "foundation",
    why: "Ha & Schmidhuber latent generative world model for RL",
  },
  {
    category: "world-models",
    title: "A Path Towards Autonomous Machine Intelligence",
    role: "foundation",
    why: "LeCun JEPA / world-model architecture vision",
  },
  {
    category: "world-models",
    title: "Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture",
    role: "foundation",
    why: "I-JEPA — non-generative representation prediction",
  },
  {
    category: "world-models",
    title: "Revisiting Feature Prediction for Learning Visual Representations from Video",
    role: "foundation",
    why: "V-JEPA — video world model via feature prediction",
  },
  {
    category: "world-models",
    title: "Dream to Control: Learning Behaviors by Latent Imagination",
    role: "foundation",
    why: "Dreamer — latent imagination for control",
  },
  {
    category: "world-models",
    title: "Mastering Diverse Domains through World Models",
    role: "foundation",
    why: "DreamerV3 — generalist world-model RL",
  },
  {
    category: "world-models",
    title: "Learning Latent Dynamics for Planning from Pixels",
    role: "foundation",
    why: "PlaNet — latent dynamics planning",
  },
  {
    category: "world-models",
    title: "Mastering Atari, Go, Chess and Shogi by Planning with a Learned Model",
    role: "foundation",
    why: "MuZero — model-based planning without rules",
  },
  {
    category: "world-models",
    title: "Recurrent World Models Facilitate Policy Evolution",
    role: "foundation",
    why: "Evolving policies inside world-model rollouts",
  },
  {
    category: "world-models",
    title: "Learning Invariant Representations for Reinforcement Learning without Reconstruction",
    role: "foundation",
    why: "Contrastive / invariant latent state for RL",
  },

  // --- Meta-memory & external memory ---
  {
    category: "meta-memory",
    title: "Neural Turing Machines",
    role: "foundation",
    why: "Differentiable external memory — early meta-memory",
  },
  {
    category: "meta-memory",
    title: "Hybrid computing using a neural network with dynamic external memory",
    role: "foundation",
    why: "Differentiable Neural Computer",
  },
  {
    category: "meta-memory",
    title: "Memory Networks",
    role: "foundation",
    why: "Explicit memory slots for reasoning",
  },
  {
    category: "meta-memory",
    title: "End-To-End Memory Networks",
    role: "foundation",
    why: "End-to-end trainable memory over facts",
  },
  {
    category: "meta-memory",
    title: "Transformer-XL: Attentive Language Models Beyond a Fixed-Length Context",
    role: "foundation",
    why: "Segment-level recurrence for long context",
  },
  {
    category: "meta-memory",
    title: "Memorizing Transformers",
    role: "foundation",
    why: "Transformer with external memory via k-NN lookup",
  },
  {
    category: "meta-memory",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    role: "foundation",
    why: "RAG — retrieve then generate",
  },
  {
    category: "meta-memory",
    title: "MemGPT: Towards LLMs as Operating Systems",
    role: "foundation",
    why: "Hierarchical memory for long-horizon LLM agents",
  },
  {
    category: "meta-memory",
    title: "Titans: Learning to Memorize at Test Time",
    role: "foundation",
    why: "Neural long-term memory at test time",
  },
  {
    category: "meta-memory",
    title: "Retrieval-Augmented Generation for Large Language Models: A Survey",
    role: "foundation",
    why: "Survey of retrieval + memory for LLMs",
  },
  {
    category: "meta-memory",
    title: "Recurrent Memory Transformer",
    role: "method",
    why: "Recurrent memory transformer for long sequences",
  },
];

async function ingestEntry(
  client: S2Client,
  entry: SeedEntry,
  existingIds: Set<string>
): Promise<void> {
  let match: Awaited<ReturnType<S2Client["matchPaperByTitle"]>> = null;

  if (entry.paperId) {
    try {
      match = await client.getPaper(entry.paperId);
    } catch {
      console.warn(`[SKIP no paper] ${entry.category}: ${entry.paperId}`);
      return;
    }
  } else if (entry.title) {
    match = await client.matchPaperByTitle(entry.title);
    if (!match) {
      console.warn(`[SKIP no match] ${entry.category}: ${entry.title}`);
      return;
    }
  } else {
    return;
  }

  if (!match) return;

  if (existingIds.has(match.paperId)) {
    console.log(`[SKIP exists] ${match.title}`);
    return;
  }
  console.log(`[${entry.category}] Matched: ${match.title} (${match.paperId})`);
  const record = await ingestPaperData(match, "meta", entry.role, entry.why);
  existingIds.add(record.paperId);
  console.log(`  Ingested: ${record.title}`);
}

async function main(): Promise<void> {
  loadEnv();
  const client = new S2Client();
  const manifest = await readManifest(metaManifestPath());
  const existingIds = new Set(manifest.map((p) => p.paperId));

  console.log(`Meta corpus: ${existingIds.size} papers already ingested`);
  console.log(`Attempting ${CORPUS.length} curated entries...\n`);

  let added = 0;
  for (const entry of CORPUS) {
    const before = existingIds.size;
    await ingestEntry(client, entry, existingIds);
    if (existingIds.size > before) added++;
  }

  console.log(`\nDone. Added ${added} papers. Meta total: ${existingIds.size}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
