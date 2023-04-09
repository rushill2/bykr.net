import unittest
import requests

class TestApp(unittest.TestCase):

    def test_index(self):
        # Test the index route returns a 200 response
        response = requests.get("http://localhost:5000/")
        self.assertEqual(response.status_code, 200)

    def test_post(self):
        # Test that the post route returns a 200 response
        data = {"flag": "const"}
        response = requests.post("http://localhost:5000/post", json=data)
        self.assertEqual(response.status_code, 200)

    def test_locate(self):
        # Test that locate route returns a JSON object with the expected keys
        response = requests.get("http://localhost:5000/locate")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("lat" in data)
        self.assertTrue("lng" in data)

    def test_nearby(self):
        # Test that the nearby route returns a JSON object with the expected keys
        response = requests.get("http://localhost:5000/nearby")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("results" in data)

    def test_details(self):
        # Test that the details route returns a JSON object with the expected keys
        response = requests.get("http://localhost:5000/details")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("result" in data)

    def test_name(self):
        # Test that the name route returns a JSON object with the expected keys
        response = requests.get("http://localhost:5000/nameSearch")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue("results" in data)

if __name__ == '__main__':
    unittest.main()