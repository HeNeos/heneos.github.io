---
layout: post
title: Tutorial | Summatory Functions
subtitle: Summatory Functions
gh-repo: HeNeos/heneos.github.io
gh-badge: [star, follow]
comments: true
tags: [Tutorial, Draft]
---

\begin{aligned}
\sum_{i=1}^{n} \sum_{d\vert i} \mu(d) \frac{d}{i} &= \sum_{a\leq \sqrt{n}} \sum_{b\leq n/a} \mu(a)b + \sum_{b\leq \sqrt{n}} \sum_{a\leq n/b} \mu(a)b - \sum_{a\leq \sqrt{n}} \sum_{b \leq \sqrt{n}} \mu(a)b\cr
1 &= \sum_{a\leq \sqrt{n}} \mu(a)\frac{n}{a} + \sum_{b\leq \sqrt{n}} \sum_{k\leq n/b} \mu(k) - \sum_{a\leq \sqrt{n}} \mu(a)\sqrt{n} \cr
&= \sum_{a\leq \sqrt{n}} \mu(a)\frac{n}{a} + \sum_{k\leq n} \mu(k) + \sum_{b=2}^{\sqrt{n}} \sum_{k\leq n/b} \mu(k) - \sum_{a\leq \sqrt{n}} \mu(a)\sqrt{n} \cr
\end{aligned}

\begin{aligned}
\sum_{k\leq n} \mu(k) &= 1 - \sum_{a\leq \sqrt{n}} \mu(a)\frac{n}{a} - \sum_{b=2}^{\sqrt{n}} \sum_{k\leq n/b} \mu(k) + \sum_{a\leq \sqrt{n}} \mu(a)\sqrt{n} \cr
\mathcal{M}(n) &= 1 - \sum_{a\leq \sqrt{n}} \mu(a)\frac{n}{a} - \sum_{b=2}^{\sqrt{n}} \mathcal{M}(\frac{n}{b}) + \sqrt{n}\mathcal{M}(\sqrt{n})
\end{aligned}