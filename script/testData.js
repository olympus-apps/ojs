import "dotenv/config";
import crypto from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  SubmissionStatus,
  ReviewDecision,
} from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function decisionForStatus(status) {
  if (status === SubmissionStatus.ACCEPTED) {
    return ReviewDecision.ACCEPT;
  }
  if (status === SubmissionStatus.REJECTED) {
    return ReviewDecision.REJECT;
  }
  return randomItem([ReviewDecision.ACCEPT, ReviewDecision.REJECT]);
}

async function main() {
  try {
    console.log("Clearing database...");
    await prisma.review.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.user.deleteMany();

    console.log("Creating users...");

    await prisma.user.create({
      data: {
        name: "admin",
        email: "admin@admin",
        password: hashPassword("admin123"),
        role: Role.ADMIN,
      },
    });

    const authors = await Promise.all([
      prisma.user.create({
        data: {
          name: "Alya Rahman",
          email: "alya.rahman@example.com",
          password: hashPassword("author123"),
          role: Role.AUTHOR,
        },
      }),
      prisma.user.create({
        data: {
          name: "Daniel Pratama",
          email: "daniel.pratama@example.com",
          password: hashPassword("author123"),
          role: Role.AUTHOR,
        },
      }),
      prisma.user.create({
        data: {
          name: "Mira Santoso",
          email: "mira.santoso@example.com",
          password: hashPassword("author123"),
          role: Role.AUTHOR,
        },
      }),
    ]);

    const reviewers = await Promise.all([
      prisma.user.create({
        data: {
          name: "Nadia Wijaya",
          email: "nadia.wijaya@example.com",
          password: hashPassword("reviewer123"),
          role: Role.REVIEWER,
        },
      }),
      prisma.user.create({
        data: {
          name: "Rizky Mahendra",
          email: "rizky.mahendra@example.com",
          password: hashPassword("reviewer123"),
          role: Role.REVIEWER,
        },
      }),
      prisma.user.create({
        data: {
          name: "Felicia Gunawan",
          email: "felicia.gunawan@example.com",
          password: hashPassword("reviewer123"),
          role: Role.REVIEWER,
        },
      }),
    ]);

    console.log("Creating submissions...");

    const submissionData = [
      {
        title: "A Lightweight Benchmark for Detecting Hallucinations in Domain-Specific LLMs",
        abstract:
          "This study introduces a compact benchmark tailored to evaluate hallucination behavior in domain-specific language models. We compare lexical, semantic, and citation-grounded scoring schemes across multiple prompting conditions. Results show that citation-aware evaluation improves error detection consistency.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.SUBMITTED,
        authorId: authors[0].id,
      },
      {
        title: "Open Source Tooling Patterns for Small-Scale Editorial Teams",
        abstract:
          "This paper surveys practical tooling choices used by editorial teams operating with limited engineering support. We compare maintenance overhead, integration complexity, and auditability across common stacks. The findings highlight low-friction patterns for long-term sustainability.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.SUBMITTED,
        authorId: authors[1].id,
      },
      {
        title: "Assessing Metadata Completeness in Journal Submission Pipelines",
        abstract:
          "Incomplete metadata frequently slows review assignment and indexing quality. We quantify missing-field patterns across simulated submission rounds and evaluate lightweight validation checkpoints. Results indicate that early metadata checks reduce downstream correction effort.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.SUBMITTED,
        authorId: authors[2].id,
      },
      {
        title: "Human-in-the-Loop Quality Checks for Automated Manuscript Triage",
        abstract:
          "Automated triage can accelerate editorial handling but may introduce false rejections without oversight. We propose a human-in-the-loop checkpoint protocol for borderline manuscripts. Controlled experiments show improved fairness with minimal delay impact.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.SUBMITTED,
        authorId: authors[0].id,
      },
      {
        title: "Designing Reproducible Peer Review Workflows for Small Academic Journals",
        abstract:
          "We propose a reproducible workflow template for journals with limited editorial resources. The method standardizes reviewer assignment, decision logging, and revision checkpoints using minimal infrastructure. Early adoption data indicates improved turnaround predictability.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.UNDER_REVIEW,
        authorId: authors[1].id,
      },
      {
        title: "Cross-Lingual Metadata Quality in Open Access Repository Aggregation",
        abstract:
          "This paper analyzes metadata inconsistencies when aggregating multilingual open access repositories. We identify recurring normalization failures in author names, affiliations, and keywords. A rule-based harmonization layer reduces indexing errors significantly.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.UNDER_REVIEW,
        authorId: authors[2].id,
      },
      {
        title: "Evaluating Explainability Prompts for Automated Manuscript Screening",
        abstract:
          "Automated manuscript screening tools often provide limited rationale for decisions. We evaluate explainability-focused prompting strategies to improve transparency for editorial use. Findings indicate that structured rationales increase perceived trust without reducing screening speed.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.ACCEPTED,
        authorId: authors[0].id,
      },
      {
        title: "A Comparative Study of Reviewer Agreement Under Blind and Open Review Settings",
        abstract:
          "Reviewer agreement remains a central concern in editorial quality control. This comparative study measures decision consistency under blind and open review configurations across simulated submissions. Open review showed moderate gains in calibration for borderline manuscripts.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.ACCEPTED,
        authorId: authors[1].id,
      },
      {
        title: "Modeling Editorial Decision Latency with Queue-Aware Assignment Policies",
        abstract:
          "Editorial pipelines frequently stall due to uneven reviewer load distribution. We model decision latency using queue-aware assignment policies and test several balancing heuristics. The proposed policy reduces long-tail delays while preserving reviewer diversity.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.REJECTED,
        authorId: authors[2].id,
      },
      {
        title: "Practical Guidelines for Minimal-Overhead Journal Analytics Dashboards",
        abstract:
          "Small journals need visibility into operational performance but often lack dedicated analytics teams. We present practical implementation guidelines for low-overhead dashboards covering throughput, acceptance, and review activity. A pilot deployment demonstrates actionable weekly insights.",
        fileUrl: "https://example.com/file.pdf",
        status: SubmissionStatus.REJECTED,
        authorId: authors[0].id,
      },
    ];

    const submissions = [];
    for (const data of submissionData) {
      const submission = await prisma.submission.create({ data });
      submissions.push(submission);
    }

    console.log("Creating reviews...");

    const reviewEligible = submissions.filter(
      (submission) => submission.status !== SubmissionStatus.SUBMITTED,
    );

    const decisionComments = {
      [ReviewDecision.ACCEPT]: [
        "The manuscript is clearly structured and contributes meaningful empirical findings. Minor language edits are recommended before publication.",
        "Methodology is sound and the experimental design is appropriately justified. I recommend acceptance with small clarifications in the discussion.",
        "This paper addresses an important problem with practical relevance. The evidence supports the claims and merits acceptance.",
      ],
      [ReviewDecision.REJECT]: [
        "The current draft lacks sufficient methodological detail to reproduce the results. I recommend rejection until the core analysis is substantially revised.",
        "Key claims are not supported by robust evaluation, and baseline comparisons are incomplete. The manuscript should be reconsidered after major rework.",
        "The topic is relevant, but the contribution is not yet clear against related work. Significant restructuring is needed before further review.",
      ],
    };

    for (const submission of reviewEligible) {
      const reviewer = randomItem(reviewers);
      const decision = decisionForStatus(submission.status);
      const comment = randomItem(decisionComments[decision]);

      await prisma.review.create({
        data: {
          submissionId: submission.id,
          reviewerId: reviewer.id,
          decision,
          comment,
        },
      });
    }

    console.log("Seeding complete");
    console.log(
      `Created: 1 admin, ${authors.length} authors, ${reviewers.length} reviewers, ${submissions.length} submissions, ${reviewEligible.length} reviews`,
    );
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();

// node script/testData.js
