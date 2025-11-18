from typing import Annotated, TypedDict, List
from langgraph.prebuilt import create_react_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
import requests

@tool
def get_weather(city: str) -> str:
    """Get the current weather for a given city using Open-Meteo API."""
    try:
        # 1. Geocoding to get lat/long
        geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
        geo_response = requests.get(geo_url).json()
        
        if not geo_response.get("results"):
            return f"Could not find coordinates for {city}."
            
        location = geo_response["results"][0]
        lat = location["latitude"]
        lon = location["longitude"]
        name = location["name"]
        
        # 2. Weather data
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit"
        weather_response = requests.get(weather_url).json()
        
        current = weather_response.get("current", {})
        temp = current.get("temperature_2m")
        code = current.get("weather_code")
        
        # Simple weather code mapping
        condition = "Unknown"
        if code is not None:
            if code == 0: condition = "Clear sky"
            elif code in [1, 2, 3]: condition = "Partly cloudy"
            elif code in [45, 48]: condition = "Foggy"
            elif code in [51, 53, 55]: condition = "Drizzle"
            elif code in [61, 63, 65]: condition = "Rain"
            elif code in [71, 73, 75]: condition = "Snow"
            elif code in [95, 96, 99]: condition = "Thunderstorm"
            
        return f"Current weather in {name}: {temp}°F, {condition}."
        
    except Exception as e:
        return f"Error fetching weather: {str(e)}"

def create_agent_graph(api_key: str, model_name: str, system_prompt: str, tools: List[str] = []):
    
    llm = ChatGoogleGenerativeAI(
        model=model_name,
        google_api_key=api_key,
        temperature=0.7
    )
    
    enabled_tools = []
    if "get_weather" in tools:
        enabled_tools.append(get_weather)
        
    workflow = create_react_agent(llm, tools=enabled_tools, prompt=system_prompt)
    
    return workflow
