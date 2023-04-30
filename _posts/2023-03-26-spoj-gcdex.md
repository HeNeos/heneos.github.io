---
layout: post
title: SPOJ | GCDEX
subtitle: GCD Extreme
gh-repo: HeNeos/heneos.github.io
gh-badge: [star, follow]
tags: [SPOJ]
comments: true
---

## Statement

Given the value of $N$, you will have to find the value of $G$. The meaning of $G$ is given in the following code:

```
G = 0;
for (i = 1; i < N; i++)
  for (j = i+1; j <= N; j++) 
    G += gcd(i, j);
```

Here `gcd()` is a function that finds the greatest common divisor of the two input numbers.

## First Solution

By Mobius Function:

\begin{aligned}
  G &= \sum_{i=1}^{N} \sum_{j=i+1}^{N} \gcd(i, j)
\end{aligned}

Let $i=ak$ and $j=bk$:

\begin{aligned}
G &= \sum_{i=1}^{N}\sum_{j=i+1}^{N} \gcd(i, j)\cr
&= \sum_{k=1}^{N}\sum_{a=1}^{\lfloor N/k \rfloor}\sum_{b=a+1}^{\lfloor N/k \rfloor} k \Big\vert 1 = \gcd(a,b) \Big\vert\cr
&= \sum_{k=1}^{N}\sum_{a=1}^{\lfloor N/k \rfloor}\sum_{b=a+1}^{\lfloor N/k \rfloor} k \sum_{d=1}^{N} \mu(d) \Big\vert d \vert \gcd(a,b) \Big\vert\cr
&= \sum_{k=1}^{N}\sum_{a=1}^{\lfloor N/k \rfloor}\sum_{b=a+1}^{\lfloor N/k \rfloor} k \sum_{d=1}^{N} \mu(d) \Big\vert d \vert a \Big\vert \Big\vert d \vert b \Big\vert\cr
&= \sum_{k=1}^{N} k \sum_{d=1}^{\lfloor N/k \rfloor} \mu(d) \sum_{a=1}^{\lfloor N/k \rfloor} \Big\vert d \vert a \Big\vert \bigg( \Big\lfloor\frac{\lfloor N/k \rfloor}{d}\Big\rfloor - \Big\lfloor\frac{a}{d}\Big\rfloor \bigg)\cr
&= \sum_{k=1}^{N} k \sum_{d=1}^{\lfloor N/k \rfloor} \mu(d) \bigg( \Big \lfloor \frac{\lfloor N/k\rfloor}{d}\Big\rfloor^2 - \sum_{m=1}^{\lfloor \lfloor N/k\rfloor/d\rfloor} \frac{dm}{d} \bigg)\cr
&= \sum_{k=1}^{N} k \sum_{d=1}^{\lfloor N/k \rfloor} \mu(d) \bigg( \Big \lfloor \frac{\lfloor N/k\rfloor}{d}\Big\rfloor^2 - \frac{\big \lfloor \frac{\lfloor N/k\rfloor}{d}\big\rfloor(\big\lfloor \frac{\lfloor N/k \rfloor}{d}\big\rfloor + 1)}{2} \bigg)
\end{aligned}


Time Complexity: $O(Q n \log (n))$

### Optimization 1

Define a list $S$ of possible values of $\lfloor N/k \rfloor$:

\begin{aligned}
S &= \Big\{ 1, 2, 3, \ldots, \sqrt{N}, \frac{N}{\sqrt{N} - 1}, \ldots, \frac{N}{1} \Big\}
\end{aligned}

and define a list of intervals $V$ from $1$ to $N$ for each possible value from $S[i]$:

\begin{aligned}
V &= \Big\{ [N, N/2 + 1], [N/2, N/3+1], \ldots, \big[ \frac{N}{\sqrt{N}}, \frac{N}{\sqrt{N}-1} + 1 \big], [\sqrt{N}-1, \sqrt{N-1}], \ldots, [1, 1] \Big\}
\end{aligned}

\begin{aligned}
\forall &x \in V[i] : S[i] = N/x
\end{aligned}

### Optimization 2

Create an array with accumulate sum of mobius function:

\begin{aligned}
M[i] &= M[i-1] + \mu(i)
\end{aligned}

Now, it’s possible to iterate over possibles values of $\lfloor N/k\rfloor /d$, similar to *Optimization 1*, create all posibles values of $\lfloor S[i]/d\rfloor$ and iterate over there and multiply with accumulate sum of mobius.

Time Complexity: $O(Q n)$

```c++
#include <bits/stdc++.h>
using namespace std;
#define N 1000005
using ll = long long;
#define FIFO ios_base::sync_with_stdio(0);cin.tie(0);cout.tie(0)
int lpf[N];
void sieve(){
  for(int i=2; i<N; i++){
    if(!lpf[i]){
      lpf[i] = i;
      for(ll j=1LL*i*i; j<N; j+=i){
        if(lpf[j] == 0) lpf[j] = i;
     }
    }
  }
}
int mobius[N];
int s_mobius[N];
void cmob(){
  mobius[1] = 1;
  for(int i=2; i<N; i++){
    if(lpf[i] == i) mobius[i] = -1;
    else{
      if(lpf[i/lpf[i]] == lpf[i]) mobius[i] = 0;
      else mobius[i] = -1*mobius[i/lpf[i]];
    }
  }
  for(int i=1; i<N; i++)
    s_mobius[i] = s_mobius[i-1] + mobius[i];
}

void fill(int n, vector <int> &values, vector <pair <int,int> > &range){
  for(int i=1; 1LL*i*i<=n; i++){
    values.push_back(i);
    range.push_back({n/i, n/(i+1)+1});
  }
  int last = range[range.size()-1].second;
  while(last > 1){
    last--;
    values.push_back(n/last);
    range.push_back({last, last});
  }
}

int main(){
  sieve();
  cmob();
  int n;
  while(true){
    cin >> n; if(n == 0) break;
    ll ans = 0; vector <int> values;
    vector <pair <int,int> > range;
    fill(n, values, range);

    for(int i=0; i<values.size(); i++){
      int v = values[i];
      ll aux = 0;
      vector <int> n_v; vector <pair <int,int> > n_r;
      fill(v, n_v,n_r);
      for(int j=0; j<n_v.size(); j++){
        int k = n_v[j];
        ll s =    1LL*k*k-(1LL*k*(k+1))/2;
        aux += s*(s_mobius[n_r[j].first] - s_mobius[n_r[j].second-1]);
      }
      ll s = (1LL*range[i].first*(range[i].first+1))/2;
      s -= (1LL*range[i].second*(range[i].second-1))/2;
      ans += aux*s;
    }
    cout << ans << '\n';
  }
  return 0;
}
```

## Second Solution

Define a dynamic programming array with this concept:

\begin{aligned}
DP[n] &= \sum_{i=1}^{n}\sum_{j=i+1}^{n} \gcd(i, j) = DP[n-1] + \sum_{i=1}^{n} \gcd(i, n) - n
\end{aligned}

Let $i = ak$ and $n+1 = bk$:

\begin{aligned}
\sum_{i=1}^{n+1} \gcd(i, n+1) &= \sum_{k=1}^{n+1}k \sum_{a=1}^{(n+1)/k} \Big\vert 1 = \gcd(a,b) \Big\vert\cr
&= \sum_{k=1}^{n+1}k \sum_{a=1}^{(n+1)/k} \sum_{d=1}^{(n+1)/k} \mu(d) \Big\vert d\vert a \Big\vert \Big\vert d\vert b \Big\vert\cr
&= \sum_{k=1}^{n+1} k \Big\vert k\vert (n+1) \Big\vert \sum_{d=1}^{(n+1)/k} \mu(d) \Big\vert d\vert (n+1)/k \Big\vert \frac{(n+1)/k}{d}\cr
&= \sum_{k=1}^{n+1} k\Big\vert k\vert (n+1) \Big\vert \sum_{d\vert (n+1)/k} \mu(d) \frac{(n+1)/k}{d}\cr
&= \sum_{k\vert (n+1)} k \phi\Big(\frac{n+1}{k}\Big)
\end{aligned}

\begin{aligned}
DP[n] &= DP[n-1] + \sum_{k\vert n} k \phi(n/k) - n
\end{aligned}

Time Complexity: $O(n^{4/3} + Q)$

```cpp
#include <bits/stdc++.h>
using namespace std;
#define N 1000005
using ll = long long;
#define FIFO ios_base::sync_with_stdio(0);cin.tie(0);cout.tie(0)
int lpf[N];
void sieve(){
  for(int i=2; i<N; i++){
    if(!lpf[i]){
      lpf[i] = i;
      for(ll j=1LL*i*i; j<N; j+=i){
        if(lpf[j] == 0) lpf[j] = i;
      }
    }
  }
}
int phi[N];
void cphi(){
  phi[1] = 1;
  for(int i=2; i<N; i++){
    if(!phi[i]){
      phi[i] = i-1;
      for(ll j=2*i; j<N; j+=i){
        if(phi[j] == 0) phi[j] = j;
        phi[j] = phi[j]/i*(i-1);
      }
    }
  }
}

void generate_divisors(int n, int index, int d, vector<pair <int,int> > &factorization, vector <int> &ans){ 
  if(1LL*d*d > n) return;
  if(index == factorization.size()){
    ans.push_back(d);
    if(d*d != n) ans.push_back(n/d); 
    return;
  }
  for(int i = 0; i <= factorization[index].second; ++i){
    generate_divisors(n, index+1, d, factorization, ans); 
    d *= factorization[index].first;
  }
}

ll DP[N];
void solve(){
  DP[1] = 0; DP[2] = 1;
  for(int i=2; i<N-1; i++){
    DP[i+1] = DP[i] - (i+1);
    vector <pair <int,int> > f;
    int aux = i+1;
    while(aux > 1){
      int d = lpf[aux];
      f.push_back({d,0});
      while(aux%d == 0){
        f[f.size()-1].second++;
        aux /= d;
      }
    }
    vector <int> divisors;
    generate_divisors(i+1, 0, 1, f, divisors);
    for(int j=0; j<divisors.size(); j++){
      DP[i+1] += 1LL*((i+1)/divisors[j])*phi[divisors[j]];
    }
  }
}

int main(){
  FIFO;
  sieve();
  cphi();
  solve();
  int n;
  while(true){
    cin >> n; if(n == 0) break;
    cout << DP[n] << '\n';
  }
  return 0;
}
```