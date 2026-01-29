from external_unis import external_search
import time

print("Testing ExternalUniversitySearch...")
external_search.load_data()
results = external_search.search(name="oxford", limit=1)
print(f"Results: {results}")
if len(results) > 0:
    print("SUCCESS")
else:
    print("FAILED")
