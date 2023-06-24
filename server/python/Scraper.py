from flask import Flask, jsonify
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/scrape-urls', methods=['POST'])
def scrape_urls():
    # Access the data sent from the React app
    data = request.get_json()

    # Extract the URL from the data
    url = data.get('url')
    
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
        
        print("all urls found: " + str(urls)) 
        return urls
    else:
        # Request was unsuccessful
        print("Failed to retrieve {}. Status code: {}".format(url, response.status_code))
        return set()

def get_html_body(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for non-2xx status codes
        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')
        body = soup.body
        return str(body)
    except requests.exceptions.RequestException as e:
        print("Error occurred:", e)
        return None

if __name__ == '__main__':
    # Specify the URL you want to scrape
    url = 'https://darknore.com'
    
    # Call the scraper function to get the URLs
    urls = get_urls_from_homepage(url)
    
    # Print the URLs
    print("Scraped URLs:")
    for url in urls:
        print(url)
        print(get_html_body(url))


