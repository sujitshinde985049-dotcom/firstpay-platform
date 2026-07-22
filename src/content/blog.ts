export const posts = [
  {
    slug: "designing-resilient-recurring-payments",
    title: "Designing resilient recurring payment systems",
    excerpt:
      "A practical architecture for mandates, collection schedules, recovery, and reconciliation at enterprise scale.",
    category: "Engineering",
    date: "18 July 2026",
    readTime: "7 min read",
    content: [
      "Recurring payments are not a single API call. They are a long-running relationship between customer consent, payment instructions, operational controls, and downstream financial systems.",
      "Resilient systems make every write idempotent, treat webhooks as durable events, and model mandate and payment states independently. This prevents temporary network failures from becoming customer-facing inconsistencies.",
      "Operations teams need the same quality of tooling as developers: searchable histories, reason-coded exceptions, safe retry actions, and reconciliation records that link every collection to its mandate and business context.",
    ],
  },
  {
    slug: "upi-autopay-enterprise-guide",
    title: "UPI AutoPay: an enterprise implementation guide",
    excerpt:
      "What product, engineering, and operations teams should align on before launching recurring UPI collections.",
    category: "Payments",
    date: "10 July 2026",
    readTime: "6 min read",
    content: [
      "A successful UPI AutoPay launch begins with the customer journey, but it succeeds through disciplined lifecycle operations.",
      "Teams should agree on mandate limits, frequency rules, notification ownership, webhook processing, retry behavior, and support playbooks before production traffic begins.",
      "The most effective implementations expose mandate and collection status to every relevant system while keeping one authoritative operational record.",
    ],
  },
  {
    slug: "mandate-operations-at-scale",
    title: "Mandate operations at scale",
    excerpt:
      "How high-volume teams structure ownership, permissions, exception queues, and audit history.",
    category: "Operations",
    date: "28 June 2026",
    readTime: "5 min read",
    content: [
      "Mandate volume changes the nature of operations. Manual lookup and broad administrative access quickly become sources of delay and risk.",
      "High-performing teams separate read, support, finance, developer, and administrative permissions. They route exceptions by reason and retain a complete history of every action.",
      "A unified control plane reduces fragmented decisions and gives leadership a reliable view of mandate health and collection outcomes.",
    ],
  },
] as const;

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
