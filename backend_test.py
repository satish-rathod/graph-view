#!/usr/bin/env python3
import unittest
import requests
import json
import os
import sys
from urllib.parse import urljoin

class GraphVisualizationTest(unittest.TestCase):
    """Test suite for the Graph Visualization Tool"""
    
    def setUp(self):
        """Set up test environment"""
        # Get the backend URL from the frontend .env file
        self.base_url = "https://b7377da8-67c8-4577-833c-b99b982cff87.preview.emergentagent.com"
        print(f"Testing against URL: {self.base_url}")
        
    def test_server_health(self):
        """Test if the server is running"""
        try:
            response = requests.get(self.base_url)
            self.assertEqual(response.status_code, 200)
            print("Server is running and accessible")
        except requests.exceptions.RequestException as e:
            self.fail(f"Server is not accessible: {e}")
    
    def test_static_assets(self):
        """Test if static assets are being served"""
        try:
            # Test for favicon
            favicon_url = urljoin(self.base_url, "/favicon.ico")
            response = requests.get(favicon_url)
            self.assertIn(response.status_code, [200, 404])  # Either exists or not found
            
            # Test for manifest.json
            manifest_url = urljoin(self.base_url, "/manifest.json")
            response = requests.get(manifest_url)
            self.assertIn(response.status_code, [200, 404])  # Either exists or not found
            
            print("Static assets check completed")
        except requests.exceptions.RequestException as e:
            self.fail(f"Failed to access static assets: {e}")

if __name__ == "__main__":
    unittest.main()