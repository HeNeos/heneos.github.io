---
layout: post
title: Tutorial | Summatory Functions
subtitle: Summatory Functions
gh-repo: HeNeos/heneos.github.io
gh-badge: [star, follow]
comments: true
tags: [Tutorial, Draft]
---

## Lucy's Algorithm

Define $S(n, p_{i})$ as the sum in a sieve after sieving the prime $p_{i}$.

### $\pi$ function

If each number in the sieve contributes its value in the $k$-th power if it's prime and 0 otherwise, then the sum in the sieve:

\begin{aligned}
S(n, p_{i}) = S(n, p_{i-1}) - p_{i}^{k}(S(n/p_{i}, p_{i-1}) - S(p-1, p_{i-1}))
\end{aligned}

It's enough to sieve until $\sqrt{n}$ to mark all the numbers in the sieve as primes or not, then:

\begin{aligned}
\pi(n) = S(n, \sqrt{n}) &= S(n, p_{i-1}) - (S(n/p_{i}, p_{i-1}) - S(p-1, p_{i-1}))\cr
\Pi(n) = S(n, \sqrt{n}) &= S(n, p_{i-1}) - p_{i}(S(n/p_{i}, p_{i-1}) - S(p-1, p_{i-1}))
\end{aligned}

and the base case is $-1 + \sum_{i\leq n} i^{k}$.

## Hyperbola method

Let:

\begin{aligned}
(f*g)(n) = \sum_{d\vert n} f(n) g(n/d) = \sum_{ab = n} f(a)g(b)
\end{aligned}

then:

\begin{aligned}
\sum_{n \leq x} (f*g)(n) &= \sum_{n \leq x} \sum_{ab = n} f(a)g(b)\cr
&= \sum_{ab \leq x} f(a)g(b)\cr
&= \sum_{a \leq \alpha} \sum_{b \leq x/a} f(a)g(b) + \sum_{b \leq \beta} \sum_{a \leq x/b} f(a)g(b) - \sum_{\substack{a \leq \alpha\\ b \leq \beta}} f(a)g(b)
\end{aligned}

Commonly, $\alpha = \beta = \sqrt{n}$ are the efficient values.

## $\varphi$ and $\Phi$ functions

### Using hyperbola method

Let $f(n) = \varphi(n)$ and $g(n) = 1$:

\begin{aligned}
\sum_{i=1}^{n} \sum_{d\vert i} \varphi(d) &= \sum_{a\leq \sqrt{n}} \sum_{b\leq n/a} \varphi(a) + \sum_{b\leq \sqrt{n}} \sum_{a\leq n/b} \varphi(a) - \sum_{a\leq \sqrt{n}} \sum_{b \leq \sqrt{n}} \varphi(a)\cr
\sum_{i=1}^{n} i &= \sum_{a\leq \sqrt{n}} \varphi(a) \frac{n}{a} + \sum_{b\leq \sqrt{n}} \sum_{a\leq n/b} \varphi(a) - \sum_{a\leq \sqrt{n}} \varphi(a) \sqrt{n}\cr
T(n) &= \sum_{a\leq \sqrt{n}} \varphi(a) \frac{n}{a} + \sum_{b=2}^{\sqrt{n}} \sum_{a\leq n/b} \varphi(a) + \sum_{k\leq n} \varphi(k) - \sqrt{n} \sum_{a\leq \sqrt{n}} \varphi(a)
\end{aligned}

\begin{aligned}
\sum_{k\leq n} \varphi(k) &= T(n) - \sum_{a\leq \sqrt{n}} \varphi(a) \frac{n}{a} - \sum_{b=2}^{\sqrt{n}} \sum_{a\leq n/b} \varphi(a) + \sqrt{n} \sum_{a\leq \sqrt{n}} \varphi(a)\cr
\Phi(n) &= T(n) - \sum_{a\leq \sqrt{n}} \varphi(a) \frac{n}{a} - \sum_{b=2}^{\sqrt{n}} \Phi(n/b) + \sqrt{n} \Phi(\sqrt{n})
\end{aligned}

## $\mu$ and $\mathcal{M}$ functions

### Using hyperbola method

Let $f(n) = \mu(n)$ and $g(n) = 1$:

\begin{aligned}
\sum_{i=1}^{n} \sum_{d\vert i} \mu(d) &= \sum_{a\leq \sqrt{n}} \sum_{b\leq n/a} \mu(a) + \sum_{b\leq \sqrt{n}} \sum_{a\leq n/b} \mu(a) - \sum_{a\leq \sqrt{n}} \sum_{b \leq \sqrt{n}} \mu(a)\cr
1 &= \sum_{a\leq \sqrt{n}} \mu(a)\frac{n}{a} + \sum_{b\leq \sqrt{n}} \sum_{k\leq n/b} \mu(k) - \sum_{a\leq \sqrt{n}} \mu(a)\sqrt{n} \cr
&= \sum_{a\leq \sqrt{n}} \mu(a)\frac{n}{a} + \sum_{k\leq n} \mu(k) + \sum_{b=2}^{\sqrt{n}} \sum_{k\leq n/b} \mu(k) - \sum_{a\leq \sqrt{n}} \mu(a)\sqrt{n}
\end{aligned}

\begin{aligned}
\sum_{k\leq n} \mu(k) &= 1 - \sum_{a\leq \sqrt{n}} \mu(a)\frac{n}{a} - \sum_{b=2}^{\sqrt{n}} \sum_{k\leq n/b} \mu(k) + \sum_{a\leq \sqrt{n}} \mu(a)\sqrt{n}\cr
\mathcal{M}(n) &= 1 - \sum_{a\leq \sqrt{n}} \mu(a)\frac{n}{a} - \sum_{b=2}^{\sqrt{n}} \mathcal{M}(\frac{n}{b}) + \sqrt{n}\mathcal{M}(\sqrt{n})
\end{aligned}

### Misc.

#### Statement

\begin{aligned}
\sum_{i=1}^{N} \mu(i)^{2} = \sum_{i=1}^{\lfloor\sqrt{N}\rfloor} \mu(i) \bigg\lfloor \frac{N}{i^{2}} \bigg\rfloor
\end{aligned}

#### Proof

Let

\begin{aligned}
\mu(n)^{2} = \sum_{k^{2} | n} \mu(k)
\end{aligned}

then:

\begin{aligned}
\sum_{i=1}^{N} \mu(i)^{2} &= \sum_{i=1}^{N} \sum_{k^{2} | i} \mu(k)\cr
&= \sum_{i=1}^{N} \sum_{k=1}^{N} \Big\vert k^{2} \vert i \Big\vert \mu(k)\cr
&= \sum_{k=1}^{N} \mu(k) \sum_{i=1}^{N} \Big\vert k^{2} \vert i \Big\vert\cr
&= \sum_{k=1}^{\sqrt{N}} \mu(k) \bigg\lfloor \frac{N}{k^{2}} \bigg\rfloor
\end{aligned}

## Resources

- [MuthuVeerappanR's blog](http://am-just-a-nobody.blogspot.com/2015/04/metens-function.html)