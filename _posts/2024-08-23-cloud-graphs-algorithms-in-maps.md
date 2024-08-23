---
layout: post
title: Cloud | Graphs Algorithms in Maps
subtitle: Graph Algorithms in Maps
gh-repo: HeNeos/heneos.github.io
gh-badge: [star, follow]
comments: true
tags: [Cloud, Graphs, Algorithms]
---

I've been postponing the post for this small fun project since many weeks. Don't blame me, I've been still working on more project euler problems and studying for the AWS Data Engineer Certification.

Anyway, it's better later than never.

Just to give a small introduction about what is this project about: I've saw that is possible to use `NetworkX` python library to get the graph representation of a real map using `OpenStreetMaps`, it's not only a graph connection with vertex and edges, it also includes some metadata from roads that *could be used as a weight* for edges, ~~at this point, you probably already know to where I'm pointing out~~.

So, think a bit about **maps**, what can you do with them?

1. Find if there is a *path* between two positions `A` and `B`.
2. If there is a *path* between `A` and `B`, what is the *shortest* one?
3. If there is a *path* between `A` and `B`, what is the *fastest* one?

and there are a lot of more questions that you can have and can be answered with a map, some of them easier than other.

However, at this point let's focus only on the third one, which in some sense also involves the number 1 and 2.

So, the obvious question here is, **how?**. Unless, you've never took a class from algorithms, you already know the famous `Dijkstra algorithm`, which is used to find shortest path in graphs ~~with some limitations~~.

I'm not going to explain how Dijkstra algorithm works because it's really easy to find info about it on internet, instead I'm going to focus on how to build the application.

## Getting the position

At the beginning, I deployed this project using latitude and longitude, however it's really impractical since it's easier for humans to know the street name instead of those pair values.

First step is then to translate natural language to latitude, langitude values. It could be a hard task because it implies `NLP` algorithms, however `OpenStreetMap` allows us to use its API to find it without more troubles.

```py
def get_lat_lon(address: str) -> Optional[Coordinates]:
    url = "https://nominatim.openstreetmap.org/search"
    params: Dict[str, str | int] = {"q": address, "format": "json", "limit": 1}
    response = requests.get(url, params=params, headers=HEADERS)
    if response.status_code == 200 and response.json():
        location = response.json()[0]
        return Coordinates(
            latitude=float(location["lat"]), longitude=float(location["lon"])
        )
    return None
```

### Validating positions

The biggest issue for this application is `downloading` and `plotting` the maps, the problem is that if you want to find the shortest path between Paris and Berlin, then you have to download a map which contains both and it's really heavy. So, for now we are also limiting it to positions in the same city.

If we know the latitude and longitude for the `source` and `destination`, then we have to verify know if both are in the same country and city:

```py
def get_current_location(
    coordinates: Coordinates,
) -> Tuple[Optional[str], Optional[str]]:
    latitude, longitude = (
        round(coordinates.latitude, 6),
        round(coordinates.longitude, 6),
    )
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}"
    response = requests.get(url, headers=HEADERS)
    data: Dict[str, Dict[str, str]] = response.json()
    if "address" not in data:
        return (None, None)
    address = data["address"]
    city: Optional[str] = address.get("city", None)
    country: Optional[str] = address.get("country", None)
    return (city, country)

```

