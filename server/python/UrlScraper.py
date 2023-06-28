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


@app.route('/api/getHtmlBodies', methods=['POST'])
def grab_html():

    # print("hiiii")
    print(request.data)  # Check the raw request data

    payload = request.get_json()

    webpage_bodies = {}  # Dictionary to store webpage URLs and their HTML bodies

    scenarios = []

    # Loop through scenarios and extract webpage URLs
    for scenario in payload["testCase"]["scenarios"]:
        scenario_id = scenario.get("id")
        if scenario_id is None or scenario_id == "":
            print("scenario_id: {}".format(scenario_id))
            continue  # Skip to the next scenario if id is null
        
        for testStep in scenario["testSteps"]:
            print("testStep: {}".format(testStep))

            webpage_url = testStep.get("webpage", "")
            print("webpage_url: {}".format(webpage_url))
            if webpage_url not in webpage_bodies:
                webpage_bodies[webpage_url] = get_html_body(webpage_url)
                print("web bodies Webpage URL: {}".format(webpage_url))
            testStep["html"] = webpage_bodies.get(webpage_url, "")
        scenarios.append(scenario)

    # response = {"scenarios": scenarios}
    # response_json = json.dumps(response)  # Convert dictionary to JSON string
    # print("response: {}".format(response_json))
    # return response_json


    response = {"scenarios": scenarios}
    response_json = json.dumps(response)  # Convert dictionary to JSON string
    print("response:", response_json)
    return response_json

    # for webpage_url, body in webpage_bodies.items():
    #     print("Webpage URL: {}".format(webpage_url))
    #     print("HTML Body:{}".format(body))



def get_html_body(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for non-2xx status codes
        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')
        body = soup.body
        print("HTML Body:{}".format(str(body)))
        return str(body)
    except requests.exceptions.RequestException as e:
        print("Error occurred:", e)
        return None

if __name__ == '__main__':
    app.run(port=8000)
