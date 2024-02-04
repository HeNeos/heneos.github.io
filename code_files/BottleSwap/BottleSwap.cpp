#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using vi = vector <int>;
using pii = pair <int, int>;

const int Levels = 9;
const int NOfBottles = 7;
int NOfLiquids = 0;

string encodeBottleState(short int bottleState[Levels]){
    string state = "";
    for(int i=0; i<Levels; i++){
        state += to_string(bottleState[i]);
        if(i != Levels - 1) state += " ";
    }
    return state;
}

struct Bottle{
    // [1, 2, 3, 2, 3, 4, 5]
    short int state[Levels];
    short int topLiquid;
    short int liquidLevel;
};

struct State{
    Bottle state[NOfBottles];
    State* previousState;
    pair <short int, short int> lastMovement;
    short int howMuchMoved;
};

string encodeState(State state){
    string ans = "";
    for(int i=0; i<NOfBottles; i++){
        Bottle currentBottle = state.state[i];
        string x = encodeBottleState(currentBottle.state);
        for(int j=x.size(); j<Levels; j++) x += "0";
        ans += x;
        if(i != NOfBottles - 1) ans += ",";
    }
    return ans;
}

bool isValidToMove(Bottle fromBottle, Bottle toBottle){
    if(fromBottle.liquidLevel <= 0) return false;
    if(toBottle.liquidLevel >= Levels) return false;

    if(toBottle.topLiquid == 0) return true;
    return fromBottle.topLiquid == toBottle.topLiquid;
}

int howMuchToMove(Bottle fromBottle, Bottle toBottle){
    int c = 0;
    if(isValidToMove(fromBottle, toBottle)){
        int fromLevel = fromBottle.liquidLevel;
        while(fromBottle.state[fromLevel-1] == fromBottle.topLiquid){
            c++;
            fromLevel--;
            if(fromLevel == 0) break;
        }
        c = min(c, Levels - toBottle.liquidLevel);
    }
    return c;
}

int measureEntropy(Bottle &bottle){
    if (!bottle.liquidLevel) return 0;
    int entropy = 1; 
    int previous_liquid = bottle.state[0];
    for(int i=1; i<Levels; i++){
        int current_liquid = bottle.state[i];
        if (current_liquid == 0) break;
        if (current_liquid != previous_liquid) entropy *= 2;
        previous_liquid = current_liquid;
    }
    return entropy;
}

int measureEntropy(State &state){
    int entropy = 0;
    for (int i=0; i<NOfBottles; i++)
        entropy += measureEntropy(state.state[i]);
    return entropy;
}

bool isFinalState(Bottle bottle){
    for(int i=0; i<Levels; i++){
        if(bottle.state[i] == 0) continue;
        if(bottle.state[i] != bottle.state[0]) return false;
    }
    return true;
}

bool isFinalState(State state){
    for(int i=0; i<NOfBottles; i++){
        if(!isFinalState(state.state[i])) return false;
    }
    if (measureEntropy(state) > NOfLiquids) return false;
    return true;
}

void moveLiquid(Bottle &fromBottle, Bottle &toBottle, int amount){
    int liquidToMove = fromBottle.topLiquid;
    int pos = fromBottle.liquidLevel - 1;
    for(int i=0; i<amount; i++) fromBottle.state[pos-i] = 0;
    fromBottle.liquidLevel -= amount;


    if(pos-amount >= 0) fromBottle.topLiquid = fromBottle.state[pos-amount];
    else fromBottle.topLiquid = 0;

    pos = toBottle.liquidLevel;
    toBottle.topLiquid = liquidToMove;
    for(int i=0; i<amount; i++) toBottle.state[pos+i] = liquidToMove;
    toBottle.liquidLevel += amount;
}

State moveLiquid(State& initialState, int from, int to, int amount){
    State newState = initialState;
    moveLiquid(newState.state[from], newState.state[to], amount);
    newState.previousState = new State(initialState);
    newState.lastMovement = {from, to};
    newState.howMuchMoved = amount;
    return newState;
}

void printSolution(State &sol){
    vector <pair<int, int> > movements;
    vector <short int> amount;
    vector <string> states;
    while(true){
        pair <int, int> currentMovement = sol.lastMovement;
        int from = currentMovement.first;
        int to = currentMovement.second;
        if(from == -1 and to == -1) break;
        movements.push_back(currentMovement);
        states.push_back(encodeState(sol));
        amount.push_back(sol.howMuchMoved);
        sol = *sol.previousState;
    }
    cout << movements.size() << '\n';
    reverse(movements.begin(), movements.end());
    reverse(states.begin(), states.end());
    reverse(amount.begin(), amount.end());

    cout << "SOLUTION:\n";
    cout << encodeState(sol) << '\n';
    for(int i=0; i<movements.size(); i++) cout << states[i] << '\n';
    cout << "MOVEMENTS:\n";
    for(int i=0; i<movements.size(); i++){
        int from = movements[i].first;
        int to = movements[i].second;
        cout << from << " "  << to << " " << amount[i] << '\n';
    }
}

void bfsLiquidPouring(State initialState) {
    queue<State> q;
    unordered_set<string> visited; // Use a hash set to store visited states.

    // Enqueue the initial state.
    q.push(initialState);
    visited.insert(encodeState(initialState));
    int minVisibleEntropy = (1<<20);
    while (!q.empty()) {
        State current = q.front();
        q.pop();
        if (isFinalState(current)) {
            printSolution(current);
            return;
        }
        int initialEntropy = measureEntropy(current);
        if (initialEntropy > 1.44*minVisibleEntropy) continue;

        // Generate successor states by pouring liquids between bottles.
        vector <State> futureStates;
        vector <pii> futureStatesEntropies;
        int position = 0;
        for (int i = 0; i < NOfBottles; i++) {
            for (int j = 0; j < NOfBottles; j++) {
                if (i != j) {
                    int amount = howMuchToMove(current.state[i], current.state[j]);
                    if(amount <= 0) continue;
                    State newState = moveLiquid(current, i, j, amount);
                    string encodedState = encodeState(newState);
                    if (visited.find(encodedState) == visited.end()) {
                        futureStates.push_back(newState);
                        futureStatesEntropies.push_back({measureEntropy(newState), position}); position++;
                        visited.insert(encodedState);
                    }
                }
            }
        }
        sort(futureStatesEntropies.begin(), futureStatesEntropies.end());
        int prunningFactor = 2;
        int minBranches = 5;
        int futureBranchSize = min(position, max(position/prunningFactor, minBranches));
        if (position) minVisibleEntropy = min(minVisibleEntropy, futureStatesEntropies[0].first);
        for (int i=0; i<futureBranchSize; i++) {
            if (futureStatesEntropies[i].first > 1.2*initialEntropy)
                break;
            int p = futureStatesEntropies[i].second;
            q.push(futureStates[p]);
        }
    }
}

void printState(Bottle bottle){
    for(int i=0; i<Levels; i++){
        cout << bottle.state[i] << " ";
    }
    cout << '\n';
}

void printState(State state){
    for(int i=0; i<NOfBottles; i++){
        cout << i+1 << "===================\n";
        printState(state.state[i]);
    }
}

int main(){
    /*  Red = 1
        Green = 2
        Blue = 3
        Yellow = 4
        Purple = 5
    */ 
    State initialState;
    initialState.lastMovement = {-1, -1};
    initialState.previousState = nullptr;
    for(int i=0; i<NOfBottles; i++){
        int level; cin >> level;
        initialState.state[i].liquidLevel = level;
        for(int j=0; j<level; j++){
            int liquid; cin >> liquid;
            initialState.state[i].state[j] = liquid;
            initialState.state[i].topLiquid = liquid;
            NOfLiquids = max(NOfLiquids, liquid);
        }
        for(int j=level; j<Levels; j++){
            initialState.state[i].state[j] = 0;
            initialState.state[i].topLiquid = 0;
        }
    }
    // printState(initialState);
    bfsLiquidPouring(initialState);
    return 0;
}
