#include <bits/stdc++.h>
using namespace std;
using ll = long long;
// #define MAXN 10000000
#define MAXN 10000
using pii = pair<ll, ll>;
using point = pair<int, int>;
using polygon = vector<point>;

vector <polygon> output;

set <pair <ll, pii> > triplets;
map <int, vector<int> > catetes;

// #define N 2300
#define N 1000

bool cmp(polygon a, polygon b){
  int width_a = abs(a[4].first - a[0].first);
  int height_a = abs(a[2].second - a[0].second);

  int width_b = abs(b[4].first - b[0].first);
  int height_b = abs(b[2].second - b[0].second);

  if(width_a == width_b) return height_a < height_b;
  else return width_a < width_b;
}

void generateTriplets(){
  for(int n=1; n<=N; n++){
    for(int m=n+1; m<=N; m++){
      ll a = 1LL*(m+n)*(m-n);
      ll b = 2LL*m*n;
      ll c = 1LL*m*m + 1LL*n*n;
      ll g = __gcd(a, b);
      a /= g; b /= g; c /= g;
      if(a > b) swap(a, b);
      triplets.insert(make_pair(c, make_pair(a, b)));
    }
  }
}

ll integer_sqrt(ll x){
  double sq = sqrt((double) x);
  ll lo = sq/2;
  ll hi = 2*sq;
  while(lo < hi){
    ll me = lo + (hi-lo+1)/2;
    if(me*me <= x) lo = me;
    else hi = me-1;
  }
  return lo;
}

vector <int> get_divisors(int x){
  vector <int> d;
  for(int i=1; 1LL*i*i<=x; i++){
    if(x%i == 0){
      d.push_back(i);
      if(i != x/i) d.push_back(x/i);
    }
  }
  sort(d.begin(), d.end());
  return d;
}

void print(point p){
  cout << "(" << p.first << ", " << p.second << ")";
}

void print(polygon p){
  for(int i=0; i<5; i++){
    print(p[i]);
    if(i < 4) cout << ", ";
  }
}

ll find_triangle(int width, int height){
  ll ans = 0;
  int new_base = width/2;
  vector <int> d = get_divisors(new_base);
  for(auto divisor: d){
    vector <int> triangles = catetes[divisor];
    if(triangles.size() == 0) continue;
    int k = new_base/divisor;
    for(auto triangle: triangles){
      ll perimeter = width + 2*height;
      ll a = 1LL * divisor * k;
      ll b = 1LL * triangle * k;
      if(b > height) continue;
      if(perimeter + 2*a > MAXN or perimeter + 2*b > MAXN) continue;
      int c = integer_sqrt(a*a + b*b);
      if(perimeter + 2*c <= MAXN){
        int new_height = height + b;
        ll x = 1LL*a*a + 1LL*new_height*new_height;
        ll sq = integer_sqrt(x);
        if(sq*sq == x){
          perimeter += 2*c;
          ans += perimeter;
          point A = {-width/2, 0};
          point B = {-width/2, height};
          point C = {0, height+b};
          point D = {width/2, height};
          point E = {width/2, 0};
          polygon p = {A, B, C, D, E};
          output.push_back(p);
          // cout << width << " " << height << " " << b << " " << c << "\n";
        }
      }
    }
  }
  return ans;
}

ll solve(){
  generateTriplets();
  vector <pair <ll, pii> > triangles;
  triangles.assign(triplets.begin(), triplets.end());
  sort(triangles.begin(), triangles.end());
  for(auto triangle: triangles){
    int a = triangle.second.first;
    int b = triangle.second.second;
    catetes[a].push_back(b);
    catetes[b].push_back(a);
  }
  ll ans = 0;
  for(int i=0; i<triangles.size(); i++){
    int a = triangles[i].second.first;
    int b = triangles[i].second.second;
    int c = triangles[i].first;
    if(a%2 == 0){
      for(int mult=1;; mult++){
        int new_a = a*mult;
        int new_b = b*mult;
        if(2*new_a + 2*new_b >= MAXN) break;
        ans += find_triangle(new_a, new_b);
        if(mult%2 == 0) ans += find_triangle(new_b, new_a);
      }
    }
    else{
      if(b%2 == 0){
        for(int mult=1;; mult++){
          int new_a = a*mult;
          int new_b = b*mult;
          if(2*new_b + 2*new_a >= MAXN) break;
          ans += find_triangle(new_b, new_a);
          if(mult%2 == 0) ans += find_triangle(new_a, new_b);
        }
      }
      else{
        for(int mult=2; mult; mult+=2){
          int new_a = a*mult;
          int new_b = b*mult;
          if(2*new_a + 2*new_b >= MAXN) break;
          ans += find_triangle(new_b, new_a);
          ans += find_triangle(new_a, new_b);
        }
      }
    }
  }
  sort(output.rbegin(), output.rend(), cmp);
  for(auto p: output){
    print(p);
    cout << '\n';
  }

  return ans;
}

int main(){
  cout << solve() << '\n';
  return 0;
}
