import json
import requests
import uuid
from collections import defaultdict
from pytrie import Trie

class ExternalUniversitySearch:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ExternalUniversitySearch, cls).__new__(cls)
            cls._instance.data = []
            cls._instance.country_index = defaultdict(list)
            cls._instance.name_index = dict()
            cls._instance.prefix_tree = None
            cls._instance.loaded = False
        return cls._instance

    def load_data(self):
        if self.loaded:
            return
        
        try:
            print("Loading global university data...")
            response = requests.get("https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json")
            self.data = response.json()
            
            for i in self.data:
                # Basic cleaning
                name_clean = i['name'].lower().strip()
                country_clean = i['country'].lower().strip()
                
                self.country_index[country_clean].append(i)
                # Primary name index
                self.name_index[name_clean] = i
                
                # Optional: Only index words if name is very long to avoid massive overhead
                # We'll stick to primary names for memory stability on small servers
            
            self.prefix_tree = Trie(**self.name_index)
            self.loaded = True
            print(f"✅ Loaded {len(self.data)} universities globally.")
        except Exception as e:
            print(f"Error loading global uni data: {e}")

    def search(self, country=None, name=None, limit=20, offset=0):
        if not self.loaded:
            self.load_data()
            
        filtered = self.data
        
        if name and country:
            name = name.lower().strip()
            country = country.lower().strip()
            # Try prefix match first
            try:
                name_matches = self.prefix_tree.values(prefix=name)
                filtered = [uni for uni in name_matches if uni['country'].lower() == country]
            except:
                filtered = [uni for uni in self.data if name in uni['name'].lower() and uni['country'].lower() == country]
        elif name:
            name = name.lower().strip()
            try:
                filtered = self.prefix_tree.values(prefix=name)
            except:
                filtered = [uni for uni in self.data if name in uni['name'].lower()]
        elif country:
            country = country.lower().strip()
            filtered = self.country_index.get(country, [])

        # Remove duplicates (since we indexed by multiple words)
        unique_results = []
        seen_names = set()
        for uni in filtered:
            if uni['name'] not in seen_names:
                unique_results.append(uni)
                seen_names.add(uni['name'])
        
        # Paginate
        return unique_results[offset : offset + limit]

external_search = ExternalUniversitySearch()
