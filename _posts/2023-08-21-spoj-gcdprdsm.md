---
layout: post
title: SPOJ | GCDPRDSM
subtitle: GCD Product Sum
gh-repo: HeNeos/heneos.github.io
gh-badge: [star, follow]
comments: true
tags: [SPOJ]
---

## Statement

In this problem, you will be given $q$ queries (1 $\leq$ $q$ $\leq$ $1000000$). Each query will contain a single integer $n$ ($1$ $\leq$ $n$ $\leq$ $1000000$).

For each query you have to output the following:

\begin{aligned}
    \sum_{i=1}^{n} i \gcd(i, n)
\end{aligned}

## Solution

\begin{aligned}
    S &= \sum_{i=1}^{n} i \gcd(i, n)\cr
    &= \sum_{i=1}^{n} i \sum_{k\vert n} k \Big\vert \gcd(i/k, n/k) = 1 \Big\vert
\end{aligned}

Where $k$ is the $\gcd(i, n)$. It means that $k\vert n$ and $k\vert i$.

\begin{aligned}
    S &= \sum_{i=1}^{n} i \sum_{k\vert n} k \sum_{d\vert n} \mu(d) \Big\vert d\vert \gcd(i/k, n/k) \Big\vert\cr
    &= \sum_{i=1}^{n} i \sum_{k\vert n} k \sum_{d\vert n} \mu(d) \Big\vert d\vert i/k \Big\vert \Big\vert d\vert n/k \Big\vert\cr
    &= \sum_{d\vert n} \mu(d) \sum_{k\vert n} k \Big\vert d\vert n/k \Big\vert \sum_{i=1}^{n} i \Big\vert d\vert i/k \Big\vert\cr
    &= \sum_{d\vert n} \mu(d) \sum_{k\vert n} k \Big\vert d\vert n/k \Big\vert \sum_{j=1}^{n/k} jk \Big\vert d\vert j \Big\vert
\end{aligned}

The last sum is easy to calculate because it's just the sum of multiples of $d$ up to $n/k$.

\begin{aligned}
    S &= \sum_{d\vert n} \mu(d) \sum_{k\vert n} k^{2} \Big\vert d\vert n/k \Big\vert d \frac{\frac{n/k}{d}(\frac{n/k}{d}+1)}{2}\cr
    &= \sum_{d\vert n} \mu(d) d \sum_{k\vert n} (n/k)^{2} \Big\vert d\vert k \Big\vert  \frac{k/d(k/d+1)}{2}\cr
    &= \sum_{d\vert n} \mu(d) d \sum_{k\in d\,\mathrm{div}(n/d)} (n/k)^{2} \frac{k/d(k/d+1)}{2}\cr
    &= \sum_{d\vert n} \mu(d)/d \sum_{k\vert n/d} (n/k)^{2} \frac{k(k+1)}{2}\cr
    &= \frac{n}{2}\sum_{d\vert n} \mu(d) \sum_{k \vert n/d} (k+1)\frac{n/d}{k}\cr
    &= \frac{n}{2}\sum_{d\vert n} \mu(d) \Big(\frac{n}{d} \sigma_{0}(n/d) + \sigma_{1}(n/d)\Big)\cr
    &= \frac{n}{2} \Big(n +\sum_{d\vert n} \mu(n/d) d \sigma_{0}(d)\Big)
\end{aligned}
