from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from flask_cors import CORS
import requests
import json


app = Flask(__name__)
CORS(app)

@app.route('/api/scrape-urls', methods=['POST'])
def scrape_urls():
    # Access the data sent from the React app
    data = request.get_json()

    json_str = json.dumps(data, indent=4)

    print(json_str)
    
    # Extract the URL from the data
    url = data.get('url')
    print("url" + url)

    
    if url is not None:
        # Call the scraper function to get the URLs
        urls = get_urls_from_homepage(url)
        
        # Return the URLs as a JSON response
        return jsonify(list(urls))
    else:
        return jsonify(error='Invalid request')

def get_urls_from_homepage(url):
    # Send an HTTP GET request to the homepage
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all anchor tags (links) in the HTML
        links = soup.find_all('a')
        
        # Extract the URLs from the anchor tags
        urls = set()  # Store unique URLs in a set
        for link in links:
            href = link.get('href')
            if href is not None:
                # Join the URL with the base URL if it's a relative path
                absolute_url = urljoin(url, href)
                urls.add(absolute_url)  # Add URL to the set
        
        
        array_of_urls = list(urls)  # Convert set to list

        return array_of_urls
    else:
        # Request was unsuccessful
        print("Failed to retrieve {}. Status code: {}".format(url, response.status_code))
        return set()  # Return an empty set

if __name__ == '__main__':
    app.run(port=8000)
