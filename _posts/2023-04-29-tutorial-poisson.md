---
layout: post
title: Tutorial | Possion Equation
subtitle: Nonlinear Poisson Equation & Membrane Poisson
gh-repo: HeNeos/heneos.github.io
gh-badge: [star, follow]
comments: true
tags: [Tutorial, FEA]
---

Today, I want to explain a bit about how to solve one of the simplest and fundamental equations in PDE:

\begin{aligned}
 -\grad \cdot (q(u)\grad u) = f
\end{aligned}

Here, the coefficient $q(u)$ makes the equation nonlinear.

Applying the identity $\grad \cdot (uv) = (\grad u)v + u\cdot \grad v$

\begin{aligned}
-\int_{\Omega} (\nabla \cdot (q(u)\nabla u)) v\,\mathrm{d}x &= \int_{\Omega} (q(u)\nabla u) \cdot \nabla v \, \mathrm{d} x - \int_{\Omega} \nabla\cdot (q(u)\nabla u) v \,\mathrm{d}x\cr
&= \int_{\Omega} f v\,\mathrm{d}x\cr
\text{Divergence theorem} &\cr
&= \int_{\Omega} (q(u)\nabla u) \cdot \nabla v \, \mathrm{d} x - \int_{\partial \Omega} \mathrm{n}\cdot (q(u)\nabla u) v \,\mathrm{d}s
\end{aligned}

Applying weak form transformation: $\forall v \in \partial\Omega, v = 0$

\begin{aligned}
&\int_{\Omega} (q(u)\nabla u) \cdot \nabla v \,\mathrm{d}x = \int_{\Omega} f v\,\mathrm{d}x\cr
F(u, v) &= \int_{\Omega} (q(u)\nabla u \cdot \nabla v - fv)\,\mathrm{d}x
\end{aligned}

Now, for the variational form:

\begin{aligned}
a(u,v) &= L(v)\cr
&= \int_{\Omega} (q(u)\nabla u) \cdot \nabla v \,\mathrm{d}x
\end{aligned}

and $L(u,v) = \int_{\Omega} f v\,\mathrm{d}x$

```py
V = FunctionSpace(mesh, 'P', 1)

u_D = Expression(u_ccode, degree=2)
bc = DirichletBC(V, u_D, boundary)

u = Function(V)
v = TestFunction(V)
f = Expression(f_ccode, degree=1)
F = q(u)*dot(grad(u), grad(v))*dx - f*v*dx

solve(F == 0, u, bc)
```