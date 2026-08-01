/**
 * Post-launch editorial roadmap.
 *
 * This file is intentionally not imported by the public application. The routes
 * below are reserved, not routable, not linked, and not included in the sitemap.
 */
export const historicalCaseStudyRoadmap = [
  {
    slug: "signal",
    futureRoute: "/work/signal",
    launchPriority: "after-v1",
    publicHomepageStatus: "BUILT · LICENSED · ACQUIRED",
    publicationGate:
      "Confirm transaction-publicity and archival screenshot rights before a public Production route.",
  },
  {
    slug: "playbook",
    futureRoute: "/work/playbook",
    launchPriority: "first-post-launch-historical-case-study",
    preferredStatus: "FOUNDER-CREATED PRODUCT CONCEPT · DEVELOPED TOWARD LAUNCH",
    framing:
      "A founder-created sports and literacy platform developed through product strategy, product design, fundraising, partnership development, and launch preparation.",
    capabilities: [
      "leveled reading",
      "premium sports content",
      "video",
      "quizzes",
      "child profiles",
      "rewards",
      "personalized learning",
    ],
    founderContext:
      "Steve was the sole creator and founder of Playoff, the company, and Playbook, the product.",
    developmentContext:
      "The product raised funding and was developed toward launch with Fingerprint, a children’s educational technology company with a significant distribution path.",
    outcome:
      "It did not ultimately launch after the original funding plan changed.",
    publicationGate:
      "Use only rights-cleared authentic sizzle-reel frames or approved stills; keep third-party sports brands, athlete imagery, and children off public pages until rights are confirmed.",
  },
] as const;
