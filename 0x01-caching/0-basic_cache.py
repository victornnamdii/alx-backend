#!/usr/bin/python3
"""
Learning caching
"""

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    Basic caching
    """
    def __init__(self):
        super().__init__()

    def put(self, key, item):
        """
        Add an item in the cache
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """
        Get an item by key
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
