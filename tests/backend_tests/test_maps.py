import unittest
from unittest.mock import MagicMock
from utils.maps import GeoHandler


class TestGeoHandler(unittest.TestCase):
    def setUp(self):
        self.handler = GeoHandler()

    def test_coordToPlace(self):
        # Test with valid coordinates
        data = {'data[lat]': '40.7128', 'data[lng]': '-74.0060'}
        place = self.handler.coordToPlace(data)
        self.assertEqual(place,
                         'City Hall Park, Broadway, Financial District, Manhattan Community Board 1, Manhattan, New York County, New York, 10007, United States')

        # Test with invalid coordinates
        data = {'data[lat]': 'invalid', 'data[lng]': '-74.0060'}
        place = self.handler.coordToPlace(data)
        self.assertIsNone(place)

    def test_placeDetails(self):
        # Mock the requests module
        mock_response = MagicMock()
        mock_response.json.return_value = {'status': 'OK'}
        self.handler.placeDetails = MagicMock(return_value=mock_response)

        # Test with valid place_id
        place_id = 'ChIJ7WuHvdkfEmsRwJGiTmhXtZI'
        data = self.handler.placeDetails(place_id)
        self.assertEqual(data, {'status': 'OK'})

        # Test with invalid place_id
        place_id = 'invalid'
        data = self.handler.placeDetails(place_id)
        self.assertIsNone(data)

    def test_nearbyPlaces(self):
        # Mock the requests module
        mock_response = MagicMock()
        mock_response.json.return_value = {'status': 'OK'}
        self.handler.nearbyPlaces = MagicMock(return_value=mock_response)

        # Test with valid coordinates
        lat, lng = 40.7128, -74.0060
        data = self.handler.nearbyPlaces(lat, lng)
        self.assertEqual(data, {'status': 'OK'})

        # Test with invalid coordinates
        lat, lng = 'invalid', -74.0060
        data = self.handler.nearbyPlaces(lat, lng)
        self.assertIsNone(data)

    def test_nameSearch(self):
        # Mock the requests module
        mock_response = MagicMock()
        mock_response.json.return_value = {'status': 'OK'}
        self.handler.nameSearch = MagicMock(return_value=mock_response)

        # Test with valid name
        name = 'Central Park'
        data = self.handler.nameSearch(name)
        self.assertEqual(data, {'status': 'OK'})

        # Test with invalid name
        name = 'invalid'
        data = self.handler.nameSearch(name)
        self.assertIsNone(data)


if __name__ == '__main__':
    unittest.main()
