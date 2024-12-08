import pandas as pd
import requests

# API Credentials
WEATHER_API_KEY = "63a2ee48a45c1793f83d420da58cf9da"
NEWS_API_KEY = "pub_61422383961c48adef93d9572e351e9b18ba8"

def fetch_weather(city, cache):
    if city in cache:
        return cache[city]
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        weather = {"main": data["weather"][0]["main"], "aqi": data.get("aqi", {}).get("value", 0)}
    else:
        weather = {"main": "unknown", "aqi": 0}
    cache[city] = weather
    return weather

def fetch_news(city, keywords, cache):
    if city in cache:
        return cache[city]
    url = f"https://newsdata.io/api/1/latest?apikey={NEWS_API_KEY}&q={city}"
    response = requests.get(url)
    data = response.json()
    articles = [
        article["title"]
        for article in data.get("results", [])
        if any(keyword in article["title"].lower() for keyword in keywords)
    ]
    cache[city] = articles
    return articles

def calculate_safety_index(weather, news):
    index = 100
    if weather.get("main", "").lower() in ["cyclone", "thunderstorm"]:
        index -= 20
    if weather.get("aqi", 0) > 150:
        index -= 15
    index -= 10 * len(news)
    return max(index, 0)

def check_safety(index):
    return "Safe" if index >= 70 else "Unsafe"

def parse_path_with_modes(path):
    segments = [segment.split("(") for segment in path.split(")") if segment]
    return [(segment[0], [segment[1].lower()] if len(segment) > 1 else []) for segment in segments]

def process_route(source, destination, path):
    nodes_modes = parse_path_with_modes(path)
    results = []

    weather_cache = {}
    news_cache = {}

    for node, modes in nodes_modes:
        for mode in modes:
            if mode == "air":
                keywords = ["thunderstorm", "high aqi", "fog", "fires"]
            elif mode in ["road", "rail"]:
                keywords = ["cyclone", "floods", "earthquakes", "road blockage", "protests", "fog", "fires"]
            else:
                continue

            weather = fetch_weather(node, weather_cache)
            news = fetch_news(node, keywords, news_cache)

            safety_index = calculate_safety_index(weather, news)
            results.append({
                "City": node,
                "Mode": mode,
                "Safety Index": safety_index,
                "Status": check_safety(safety_index),
                "Weather Info": weather,
                "News Articles": "; ".join(news) if news else "No relevant news",
            })

    return results

# Load and process routes
routes_df = pd.read_csv("./public/data/multi_modal_top_5_routes.csv")

user_source = input("Enter the source city: ").strip()
user_destination = input("Enter the destination city: ").strip()

filtered_routes = routes_df[
    (routes_df["Source"] == user_source) & (routes_df["Destination"] == user_destination)
]

if filtered_routes.empty:
    print(f"No routes found for Source: {user_source} and Destination: {user_destination}.")
else:
    results = []
    for _, row in filtered_routes.iterrows():
        # Process only Path1
        path = row["Path1"]
        if not pd.isna(path):
            results.extend(process_route(user_source, user_destination, path))

    if results:
        results_df = pd.DataFrame(results)
        print(results_df)
        results_df.to_csv("./public/data/Safety_Analysis_Routes.csv", index=False)
        print("Safety analysis saved to Safety_Analysis_Routes.csv.")
    else:
        print("No safety analysis results to process.")
